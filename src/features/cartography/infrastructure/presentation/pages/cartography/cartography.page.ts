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
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  EMPTY,
  filter,
  mergeWith,
  Observable,
  of,
  startWith,
  Subject,
  switchMap
} from 'rxjs';
import { Coordinates } from '../../../../core';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { combineLatestWith, map } from 'rxjs/operators';
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

  private readonly _centerView$: BehaviorSubject<CenterView> = new BehaviorSubject<CenterView>(this.cartographyConfiguration);

  private readonly _cnfsDetails$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private readonly _forceCnfsPermanence$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly _geocodeAddressError$: Subject<boolean> = new Subject<boolean>();

  private readonly _highlightedStructureId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private readonly _mapViewportAndZoom$: BehaviorSubject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );

  private readonly _searchTerm$: Subject<string> = new Subject<string>();

  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  private readonly _usagerMarker$: Observable<Feature<Point, UsagerMarkerProperties>> = this._addressToGeocode$.pipe(
    switchMap(
      (addressToGeocode: string): Observable<Coordinates> =>
        this.presenter.geocodeAddress$(addressToGeocode).pipe(
          catchError((): Observable<never> => {
            this._geocodeAddressError$.next(true);
            return EMPTY;
          })
        )
    ),
    mergeWith(this._usagerCoordinates$),
    map((usagerCoordinates: Coordinates): Feature<Point, UsagerMarkerProperties> => {
      this._geocodeAddressError$.next(false);
      this._centerView$.next(coordinatesToCenterView(usagerCoordinates, CITY_ZOOM_LEVEL));
      return usagerFeatureFromCoordinates(usagerCoordinates);
    })
  );

  public addressesFound$: Observable<AddressFoundPresentation[]> = this._searchTerm$.pipe(
    map((searchTerm: string): string => searchTerm.trim()),
    filter((searchTerm: string): boolean => searchTerm.length >= MIN_SEARCH_TERM_LENGTH),
    debounceTime(SEARCH_DEBOUNCE_TIME),
    distinctUntilChanged(),
    switchMap((searchTerm: string): Observable<AddressFoundPresentation[]> => this.presenter.searchAddress$(searchTerm))
  );

  public centerView$: Observable<CenterView> = this._centerView$.asObservable();

  public cnfsDetails$: Observable<CnfsDetailsPresentation | null> = this._cnfsDetails$.pipe(
    combineLatestWith(this._usagerMarker$.pipe(startWith(null))),
    switchMap(
      ([id, usagerMarker]: [
        string | null,
        Feature<Point, UsagerMarkerProperties> | null
      ]): Observable<CnfsDetailsPresentation | null> =>
        id == null ? of(null) : this.cnfsDetailsWithUsagerMarker$(id, usagerMarker)
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

  public geocodeAddressError$: Observable<boolean> = this._geocodeAddressError$.asObservable();

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

  public readonly usagerMarker$: Observable<Feature<Point, UsagerMarkerProperties>> = this._usagerMarker$;

  public constructor(
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  private cnfsDetailsWithUsagerMarker$(
    id: string,
    usagerMarker: Feature<Point, UsagerMarkerProperties> | null
  ): Observable<CnfsDetailsPresentation> {
    return usagerMarker == null
      ? this.presenter.cnfsDetails$(id)
      : this.presenter.cnfsDetails$(id, Coordinates.fromGeoJsonFeature(usagerMarker));
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

  public printCnfsDetails(): void {
    this.onDisplayMap(false);
    setTimeout((): void => window.print());
  }
}
