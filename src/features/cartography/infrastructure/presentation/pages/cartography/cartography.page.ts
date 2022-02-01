import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  CenterView,
  CnfsDetailsPresentation,
  MarkerEvent,
  StructurePresentation,
  coordinatesToCenterView,
  CnfsLocalityMarkerProperties,
  CnfsPermanenceMarkerProperties,
  permanenceMarkerEventToCenterView,
  AddressFoundPresentation,
  CnfsByRegionMarkerProperties,
  CnfsByDepartmentMarkerProperties,
  boundedMarkerEventToCenterView,
  UsagerMarkerProperties
} from '../../models';
import { CartographyPresenter, isGuyaneBoundedMarker } from './cartography.presenter';
import {
  BehaviorSubject,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  tap
} from 'rxjs';
import { Coordinates } from '../../../../core';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { map } from 'rxjs/operators';
import { CITY_ZOOM_LEVEL } from '../../helpers/map-constants';
import { ViewportAndZoom, ViewReset } from '../../directives';
import { usagerFeatureFromCoordinates } from '../../helpers';

// TODO Inject though configuration token
const DEFAULT_MAP_VIEWPORT_AND_ZOOM: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const MIN_SEARCH_TERM_LENGTH: number = 3;

const SEARCH_DEBOUNCE_TIME: number = 300;

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

  private readonly _searchTerm$: Subject<string> = new Subject<string>();

  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  public addressesFound$: Observable<AddressFoundPresentation[]> = this._searchTerm$.pipe(
    map((searchTerm: string): string => searchTerm.trim()),
    filter((searchTerm: string): boolean => searchTerm.length >= MIN_SEARCH_TERM_LENGTH),
    debounceTime(SEARCH_DEBOUNCE_TIME),
    distinctUntilChanged(),
    switchMap((searchTerm: string): Observable<AddressFoundPresentation[]> => this.presenter.searchAddress$(searchTerm))
  );

  public centerView$: Observable<CenterView> = this._centerView$.asObservable();

  // Todo : use empty object pattern.
  public cnfsDetails$: Observable<CnfsDetailsPresentation | null> = this._cnfsDetails$.pipe(
    switchMap(
      (id: string | null): Observable<CnfsDetailsPresentation | null> =>
        id == null ? of(null) : this.presenter.cnfsDetails$(id)
    )
  );

  public readonly departementMarkers$: Observable<FeatureCollection<Point, CnfsByDepartmentMarkerProperties>> = this.presenter
    .visibleMapCnfsByDepartmentAtZoomLevel$(this._mapViewportAndZoom$, this._forceCnfsPermanence$.asObservable())
    .pipe(
      map(
        (
          cnfsByDepartementFeatures: Feature<Point, CnfsByDepartmentMarkerProperties>[]
        ): FeatureCollection<Point, CnfsByDepartmentMarkerProperties> => ({
          features: cnfsByDepartementFeatures,
          type: 'FeatureCollection'
        })
      )
    );

  public displayDetailsStructureId: string | null = null;

  public displayMap: boolean = false;

  public highlightedStructureId$: Observable<string | null> = this._highlightedStructureId$.asObservable().pipe(delay(0));

  public readonly permanenceMarkers$: Observable<FeatureCollection<Point, CnfsPermanenceMarkerProperties>> = this.presenter
    .visibleMapCnfsPermanencesThroughViewportAtZoomLevel$(this._mapViewportAndZoom$, this._forceCnfsPermanence$.asObservable())
    .pipe(
      map(
        (
          cnfsPermanencesFeatures: Feature<Point, CnfsPermanenceMarkerProperties>[]
        ): FeatureCollection<Point, CnfsPermanenceMarkerProperties> => ({
          features: cnfsPermanencesFeatures,
          type: 'FeatureCollection'
        })
      )
    );

  public readonly regionMarkers$: Observable<FeatureCollection<Point, CnfsByRegionMarkerProperties>> = this.presenter
    .visibleMapCnfsByRegionAtZoomLevel$(this._mapViewportAndZoom$, this._forceCnfsPermanence$.asObservable())
    .pipe(
      map(
        (
          cnfsByRegionFeatures: Feature<Point, CnfsByRegionMarkerProperties>[]
        ): FeatureCollection<Point, CnfsByRegionMarkerProperties> => ({
          features: cnfsByRegionFeatures,
          type: 'FeatureCollection'
        })
      )
    );

  public structuresList$: Observable<StructurePresentation[]> = this.presenter.structuresList$(this._mapViewportAndZoom$);

  // TODO On peut merger ça plus haut pour éviter le null
  public readonly usagerMarker$: Observable<Feature<Point, UsagerMarkerProperties>> = merge(
    this.presenter.geocodeAddress$(this._addressToGeocode$),
    this._usagerCoordinates$
  ).pipe(
    tap((usagerCoordinates: Coordinates): void => {
      this._centerView$.next(coordinatesToCenterView(usagerCoordinates, CITY_ZOOM_LEVEL));
    }),
    map(
      (usagerCoordinates: Coordinates): Feature<Point, UsagerMarkerProperties> =>
        usagerFeatureFromCoordinates(usagerCoordinates)
    )
  );

  public constructor(
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

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
    this._forceCnfsPermanence$.next(isGuyaneBoundedMarker(markerEvent.markerProperties));
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

  public onSearchAddress(searchTerm: string): void {
    this._searchTerm$.next(searchTerm);
  }

  public onZoomOut(): void {
    this._forceCnfsPermanence$.next(false);
  }
}
