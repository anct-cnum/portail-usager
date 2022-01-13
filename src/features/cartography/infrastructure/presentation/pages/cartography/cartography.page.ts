import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  CenterView,
  CnfsDetailsPresentation,
  MarkerEvent,
  PointOfInterestMarkerProperties,
  StructurePresentation,
  TypedMarker,
  boundedMarkerEventToCenterView,
  coordinatesToCenterView,
  CnfsLocalityMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerProperties,
  CnfsPermanenceProperties,
  BoundedMarkers,
  permanenceMarkerEventToCenterView
} from '../../models';
import { isGuyaneBoundedMarker, addUsagerFeatureToMarkers, CartographyPresenter } from './cartography.presenter';
import { BehaviorSubject, delay, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Coordinates } from '../../../../core';
import { ViewportAndZoom, ViewReset } from '../../directives/leaflet-map-state-change';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN, Marker } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { catchError, combineLatestWith, map, startWith } from 'rxjs/operators';
import { CITY_ZOOM_LEVEL, DEPARTMENT_ZOOM_LEVEL } from '../../helpers/map-constants';

// TODO Inject though configuration token
const DEFAULT_MAP_VIEWPORT_AND_ZOOM: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
export class CartographyPage {
  private readonly _addressToGeocode$: Subject<string> = new Subject<string>();

  private _automaticLocationInProgress: boolean = false;

  private readonly _centerView$: BehaviorSubject<CenterView> = new BehaviorSubject<CenterView>(this.cartographyConfiguration);

  private readonly _cnfsDetails$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private readonly _forceCnfsPermanence$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly _highlightedStructureId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private readonly _mapViewportAndZoom$: BehaviorSubject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );

  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  private readonly _visibleMapPointsOfInterest$: Observable<Feature<Point, PointOfInterestMarkerProperties>[]> = this.presenter
    .visibleMapPointsOfInterestThroughViewportAtZoomLevel$(this._mapViewportAndZoom$, this._forceCnfsPermanence$.asObservable())
    .pipe(startWith([]));

  public centerView$: Observable<CenterView> = this._centerView$.asObservable();

  // Todo : use empty object pattern.
  public cnfsDetails$: Observable<CnfsDetailsPresentation | null> = this._cnfsDetails$.pipe(
    switchMap(
      (id: string | null): Observable<CnfsDetailsPresentation | null> =>
        id == null ? of(null) : this.presenter.cnfsDetails$(id)
    )
  );

  public displayDetailsStructureId: string | null = null;

  public displayMap: boolean = false;

  public hasAddressError: boolean = false;

  public highlightedStructureId$: Observable<string | null> = this._highlightedStructureId$.asObservable().pipe(delay(0));

  public structuresList$: Observable<StructurePresentation[]> = this.presenter.structuresList$(this._mapViewportAndZoom$);

  // TODO On peut merger ça plus haut pour éviter le null
  public readonly usagerCoordinates$: Observable<Coordinates | null> = merge(
    this.presenter.geocodeAddress$(this._addressToGeocode$),
    this._usagerCoordinates$
  ).pipe(
    tap((usagerCoordinates: Coordinates): void => {
      this._centerView$.next(coordinatesToCenterView(usagerCoordinates, CITY_ZOOM_LEVEL));
    }),
    startWith(null),
    catchError((): Observable<null> => {
      this.hasAddressError = true;
      return of(null);
    })
  );

  public readonly visibleMarkersWithUsager$: Observable<
    FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>
  > = this._visibleMapPointsOfInterest$.pipe(
    combineLatestWith(this.usagerCoordinates$),
    map(
      ([visibleMapPointsOfInterest, usagerCoordinates]: [
        Feature<Point, PointOfInterestMarkerProperties>[],
        Coordinates | null
      ]): FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> => ({
        features: addUsagerFeatureToMarkers(visibleMapPointsOfInterest, usagerCoordinates),
        type: 'FeatureCollection'
      })
    ),
    // TODO Trouver une manière plus élégante de faire un dezoom si aucune CnfsPermanence n'est affiché lors de la location automatique
    tap((featureCollection: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>): void => {
      if (this.hasNoCnfsPermanenceFollowingGeocodeOrAutolocate(featureCollection))
        this.zoomOutUpToDepartmentLevel(featureCollection);

      this._automaticLocationInProgress = false;
    })
  );

  public constructor(
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  private handleBoundedMarkerEvents(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    this._forceCnfsPermanence$.next(isGuyaneBoundedMarker(markerEvent));
    this._centerView$.next(boundedMarkerEventToCenterView(markerEvent as MarkerEvent<MarkerProperties<BoundedMarkers>>));
  }

  private handleCnfsPermanenceMarkerEvents(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    this._centerView$.next(
      permanenceMarkerEventToCenterView(markerEvent as MarkerEvent<MarkerProperties<CnfsPermanenceProperties>>)
    );
  }

  private hasNoCnfsPermanenceFollowingGeocodeOrAutolocate(
    featureCollection: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>
  ): boolean {
    return (
      this._automaticLocationInProgress &&
      featureCollection.features.length === 1 &&
      featureCollection.features[0].properties.markerType === Marker.Usager
    );
  }

  private zoomOutUpToDepartmentLevel(
    featureCollection: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>
  ): void {
    const coordinates: Coordinates = new Coordinates(
      featureCollection.features[0].geometry.coordinates[1],
      featureCollection.features[0].geometry.coordinates[0]
    );
    this._centerView$.next(coordinatesToCenterView(coordinates, DEPARTMENT_ZOOM_LEVEL + 1));
  }

  public displayCnfsDetails(id: string): void {
    this._cnfsDetails$.next(id);
    this._highlightedStructureId$.next(id);
    this.displayDetailsStructureId = id;
  }

  public hideCnfsDetails(): void {
    this._cnfsDetails$.next(null);
    this.displayDetailsStructureId != null && this._highlightedStructureId$.next(this.displayDetailsStructureId);
    this.displayDetailsStructureId = null;
  }

  public onAutoLocateUsagerRequest(coordinates: Coordinates): void {
    this._automaticLocationInProgress = true;
    this._usagerCoordinates$.next(coordinates);
  }

  public onCnfsLocalityMarkerChange(markerEvent: MarkerEvent<CnfsLocalityMarkerProperties>): void {
    this._forceCnfsPermanence$.next(isGuyaneBoundedMarker(markerEvent));
    this._centerView$.next(boundedMarkerEventToCenterView(markerEvent));
  }

  public onCnfsPermanenceMarkerChange(markerEvent: MarkerEvent<CnfsPermanenceMarkerProperties>): void {
    this._centerView$.next(permanenceMarkerEventToCenterView(markerEvent));
    this._highlightedStructureId$.next(markerEvent.markerProperties.id);
  }

  public onDisplayMap(displayMap: boolean): void {
    this.displayMap = displayMap;
    !this.displayMap && this._highlightedStructureId$.next('replay');
  }

  public onGeocodeUsagerRequest(address: string): void {
    this._automaticLocationInProgress = true;
    this._addressToGeocode$.next(address);
  }

  public onMapViewChanged($event: ViewReset): void {
    this._mapViewportAndZoom$.next({ viewport: $event.viewport, zoomLevel: $event.zoomLevel });
  }

  public onZoomOut(): void {
    this._forceCnfsPermanence$.next(false);
  }
}
