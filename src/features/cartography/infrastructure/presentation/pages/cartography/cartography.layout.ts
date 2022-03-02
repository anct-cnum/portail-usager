import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  CenterView,
  MarkerEvent,
  CnfsLocalityMarkerProperties,
  CnfsPermanenceMarkerProperties,
  CnfsByRegionMarkerProperties,
  CnfsByDepartmentMarkerProperties,
  UsagerMarkerProperties
} from '../../models';
import { CartographyPresenter, HighlightedStructure, isGuyaneBoundedMarker } from './cartography.presenter';
import {
  BehaviorSubject,
  catchError,
  delay,
  EMPTY,
  filter,
  merge,
  mergeWith,
  Observable,
  startWith,
  Subject,
  switchMap,
  tap
} from 'rxjs';
import { Coordinates } from '../../../../core';
import { Feature, FeatureCollection, Point } from 'geojson';
import { map } from 'rxjs/operators';
import { CITY_ZOOM_LEVEL } from '../../helpers/map-constants';
import { ViewportAndZoom } from '../../directives';
import { usagerFeatureFromCoordinates } from '../../helpers';
import { ActivatedRoute, Event as RouterEvent, NavigationEnd, ParamMap, Router } from '@angular/router';
import { CARTOGRAPHY_TOKEN, CartographyConfiguration } from '../../../configuration';
import { CnfsListPresenter } from '../cnfs-list';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter, CnfsListPresenter],
  templateUrl: './cartography.layout.html'
})
export class CartographyLayout {
  private readonly _addressFromQueryParamsToCoordinates$: Observable<Coordinates> = this.route.queryParamMap.pipe(
    map((params: ParamMap): string | null => params.get('address')),
    filter((address: string | null): address is string => address !== null),
    switchMap(
      (addressToGeocode: string): Observable<Coordinates> =>
        this.presenter.geocodeAddress$(addressToGeocode).pipe(
          catchError((): Observable<never> => {
            this.presenter.setGeocodeAddressError(true);
            return EMPTY;
          }),
          tap((): void => this.presenter.setGeocodeAddressError(false))
        )
    )
  );

  private readonly _coordinatesFromQueryParams$: Observable<Coordinates> = this.route.queryParamMap.pipe(
    map((params: ParamMap): [string | null, string | null] => [params.get('latitude'), params.get('longitude')]),
    filter(
      (coordinates: [string | null, string | null]): coordinates is [string, string] =>
        coordinates[0] != null && coordinates[1] != null
    ),
    map(([latitude, longitude]: [string, string]): Coordinates => new Coordinates(Number(latitude), Number(longitude)))
  );

  private readonly _displayMap$: Subject<boolean> = new Subject<boolean>();

  private _displayStructureDetails: boolean = false;

  private readonly _forceCnfsPermanence$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly _hideMapOnUrlChange$: Observable<boolean> = this.router.events.pipe(
    filter((routerEvent: RouterEvent): boolean => routerEvent instanceof NavigationEnd),
    map((): boolean => false),
    startWith(false)
  );

  private readonly _usagerMarker$: Observable<Feature<Point, UsagerMarkerProperties>> = merge(
    this._addressFromQueryParamsToCoordinates$,
    this._coordinatesFromQueryParams$
  ).pipe(
    map((usagerCoordinates: Coordinates): Feature<Point, UsagerMarkerProperties> => {
      this.presenter.setUsagerCoordinates(usagerCoordinates);
      this.presenter.setMapView(usagerCoordinates, CITY_ZOOM_LEVEL);
      return usagerFeatureFromCoordinates(usagerCoordinates);
    })
  );

  public centerView$: Observable<CenterView> = this.presenter.centerView$.pipe(delay(0));

  public readonly departementMarkers$: Observable<FeatureCollection<Point, CnfsByDepartmentMarkerProperties>> =
    this.presenter.visibleMapCnfsByDepartmentAtZoomLevel$(this._forceCnfsPermanence$.asObservable());

  public displayMap$: Observable<boolean> = this._displayMap$.pipe(mergeWith(this._hideMapOnUrlChange$));

  public displayStructureDetails$: Observable<boolean> = this.presenter.displayStructureDetails$.pipe(
    tap((displayStructureDetails: boolean): void => {
      this._displayStructureDetails = displayStructureDetails;
    })
  );

  public highlightedStructure$: Observable<HighlightedStructure> = this.presenter.highlightedStructure$;

  public readonly permanenceMarkers$: Observable<FeatureCollection<Point, CnfsPermanenceMarkerProperties>> =
    this.presenter.visibleMapCnfsPermanencesThroughViewportAtZoomLevel$(this._forceCnfsPermanence$.asObservable());

  public readonly regionMarkers$: Observable<FeatureCollection<Point, CnfsByRegionMarkerProperties>> =
    this.presenter.visibleMapCnfsByRegionAtZoomLevel$(this._forceCnfsPermanence$.asObservable());

  public readonly usagerMarker$: Observable<Feature<Point, UsagerMarkerProperties>> = this._usagerMarker$;

  public constructor(
    private readonly presenter: CartographyPresenter,
    private readonly cnfsListPresenter: CnfsListPresenter,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(CARTOGRAPHY_TOKEN) public readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  public onCnfsLocalityMarkerClick(markerEvent: MarkerEvent<CnfsLocalityMarkerProperties>): void {
    this._forceCnfsPermanence$.next(isGuyaneBoundedMarker(markerEvent.markerProperties));
    this.presenter.setMapView(markerEvent.markerPosition, markerEvent.markerProperties.boundingZoom);
  }

  public async onCnfsPermanenceMarkerClick(markerEvent: MarkerEvent<CnfsPermanenceMarkerProperties>): Promise<void> {
    await this.router.navigate(['/', markerEvent.markerProperties.id, 'details']);
  }

  public onCnfsPermanenceMarkerEnter(markerEvent: MarkerEvent<CnfsPermanenceMarkerProperties>): void {
    this.cnfsListPresenter.hint(markerEvent.markerProperties.id);
  }

  public onCnfsPermanenceMarkerLeave(): void {
    this.cnfsListPresenter.hint('');
  }

  public onDisplayMap(displayMap: boolean): void {
    this._displayMap$.next(displayMap);
  }

  public onMapViewChanged(viewportAndZoom: ViewportAndZoom): void {
    this.presenter.setViewportAndZoom(viewportAndZoom);
  }

  public onZoomOut(): void {
    this._forceCnfsPermanence$.next(false);
  }
}
