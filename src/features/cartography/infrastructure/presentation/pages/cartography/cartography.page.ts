import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  BoundedMarkers,
  CenterView,
  CnfsDetailsPresentation,
  CnfsPermanenceProperties,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  StructurePresentation,
  TypedMarker
} from '../../models';
import { isGuyaneBoundedMarker, addUsagerFeatureToMarkers, CartographyPresenter } from './cartography.presenter';
import { BehaviorSubject, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Coordinates } from '../../../../core';
import { ViewportAndZoom, ViewReset } from '../../directives/leaflet-map-state-change';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN, Marker } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { catchError, combineLatestWith, debounceTime, filter, map, skipWhile, startWith, takeWhile } from 'rxjs/operators';
import {
  boundedMarkerEventToCenterView,
  coordinatesToCenterView,
  permanenceMarkerEventToCenterView
} from '../../models/center-view/center-view.presentation-mapper';
import { CITY_ZOOM_LEVEL, DEPARTMENT_ZOOM_LEVEL } from '../../helpers/map-constants';
import { allowIfMapNotAtCityLevelOrCenterViewNotOnUsager, firstMarkerIsNotCnfsPermanence, usagerIsAlone } from '../../helpers';

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

  public displayDetails: boolean = false;

  public displayMap: boolean = false;

  public hasAddressError: boolean = false;

  public structuresList$: Observable<StructurePresentation[]> = this.presenter.structuresList$(this._mapViewportAndZoom$);

  // TODO On peut merger ça plus haut pour éviter le null
  public readonly usagerCoordinates$: Observable<Coordinates | null> = merge(
    this.presenter.geocodeAddress$(this._addressToGeocode$),
    this._usagerCoordinates$
  ).pipe(
    /*tap((usagerCoordinates: Coordinates) => {
      this._centerView$.next(coordinatesToCenterView(usagerCoordinates, CITY_ZOOM_LEVEL));
    }),*/
    startWith(null),
    catchError((): Observable<null> => {
      this.hasAddressError = true;
      return of(null);
    })
  );

  public readonly validUsagerCoordinates$: Observable<Coordinates> = this.usagerCoordinates$.pipe(
    filter((coordinates: Coordinates | null): coordinates is Coordinates => coordinates !== null)
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
    )
  );

  public readonly mapReadyAtZoomLevel$: Observable<{
    markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>;
    viewportAndZoom: ViewportAndZoom;
  }> = this.visibleMarkersWithUsager$.pipe(
    combineLatestWith(this._mapViewportAndZoom$),
    map(
      ([visibleMarkersWithUsager, viewportAndZoom]: [
        FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>,
        ViewportAndZoom
      ]): {
        markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>;
        viewportAndZoom: ViewportAndZoom;
      } => ({
        markers: visibleMarkersWithUsager,
        viewportAndZoom
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly automaticLocationDezoomBehaviorIfNoPermanenceIsVisible$: Observable<void> = this.mapReadyAtZoomLevel$.pipe(
    combineLatestWith(this._centerView$.asObservable(), this.validUsagerCoordinates$),
    skipWhile((): boolean => {
      console.log(!this._automaticLocationInProgress ? 'Not in automatic mode, skipping' : 'Dezzom activated');
      return !this._automaticLocationInProgress;
    }),
    takeWhile(
      ([markersAndViewport, centerView, usagerCoordinates]: [
        {
          markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>;
          viewportAndZoom: ViewportAndZoom;
        },
        CenterView,
        Coordinates
      ]): boolean => {
        if (
          allowIfMapNotAtCityLevelOrCenterViewNotOnUsager(
            markersAndViewport.viewportAndZoom.zoomLevel,
            centerView,
            usagerCoordinates
          )
        ) {
          console.log('allowIfMapNotAtCityLevelOrCenterViewNotOnUsager');
          return true;
        }
        console.log('markers ', markersAndViewport.markers.features.length, usagerIsAlone(markersAndViewport.markers));
        if (usagerIsAlone(markersAndViewport.markers)) {
          console.log('usagerIsAlone');
          return true;
        }

        if (firstMarkerIsNotCnfsPermanence(markersAndViewport.markers)) {
          console.log('firstMarkerIsNotCnfsPermanence');
          return true;
        }

        //if (markersAreNotCnfsPermanence(markersAndViewport.markers))

        /* return (
          allowIfMapNotAtCityLevelOrCenterViewNotOnUsager(
            markersAndViewport.viewportAndZoom.zoomLevel,
            centerView,
            usagerCoordinates
          ) || usagerIsAlone(markersAndViewport.markers)
        );*/

        // if (allowIfFirstZoomToCityLevel(markersAndViewport.viewportAndZoom.zoomLevel, centerView.zoomLevel)) return true;
        /*console.log('Is mapValidatedZoomLevel <= centerView.zoomLevel', markersAndViewport.viewportAndZoom.zoomLevel, centerView.zoomLevel, markersAndViewport.viewportAndZoom.zoomLevel >= centerView.zoomLevel);
        console.log(markersAndViewport.markers.features.length > 1 && markersAndViewport.markers.features[0].properties.markerType !== Marker.CnfsPermanence);*/
        return false; // markersAndViewport.viewportAndZoom.zoomLevel != centerView.zoomLevel;
      }
    ),
    debounceTime(400),
    map(
      ([markersAndViewport, centerView, usagerCoordinates]: [
        {
          markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>;
          viewportAndZoom: ViewportAndZoom;
        },
        CenterView,
        Coordinates
      ]): void => {
        if (usagerIsAlone(markersAndViewport.markers)) {
          console.log('USAGER ALONE NEXT ZOOM', markersAndViewport.viewportAndZoom.zoomLevel - 1);
          this._centerView$.next(coordinatesToCenterView(usagerCoordinates, DEPARTMENT_ZOOM_LEVEL + 1));
        }

        if (
          allowIfMapNotAtCityLevelOrCenterViewNotOnUsager(
            markersAndViewport.viewportAndZoom.zoomLevel,
            centerView,
            usagerCoordinates
          )
        ) {
          this._centerView$.next(coordinatesToCenterView(usagerCoordinates, CITY_ZOOM_LEVEL));
        }
      }
    )
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

  public displayCnfsDetails(id: string): void {
    this._cnfsDetails$.next(id);
    this.displayDetails = true;
  }

  public hideCnfsDetails(): void {
    this._cnfsDetails$.next(null);
    this.displayDetails = false;
  }

  public onAutoLocateUsagerRequest(coordinates: Coordinates): void {
    this._automaticLocationInProgress = true;
    this._usagerCoordinates$.next(coordinates);
  }

  public onGeocodeUsagerRequest(address: string): void {
    this._automaticLocationInProgress = true;
    this._addressToGeocode$.next(address);
  }

  public onMapViewChanged($event: ViewReset): void {
    this._mapViewportAndZoom$.next({ viewport: $event.viewport, zoomLevel: $event.zoomLevel });
  }

  public onMarkerChanged(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    switch (markerEvent.markerProperties.markerType) {
      case Marker.CnfsPermanence:
        this.handleCnfsPermanenceMarkerEvents(markerEvent);
        break;
      case Marker.CnfsByRegion:
      case Marker.CnfsByDepartment:
        this.handleBoundedMarkerEvents(markerEvent);
        break;
      case Marker.Usager:
        break;
    }
  }

  public onZoomOut(): void {
    this._forceCnfsPermanence$.next(false);
  }
}
