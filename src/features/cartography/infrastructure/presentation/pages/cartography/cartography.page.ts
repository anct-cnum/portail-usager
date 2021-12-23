import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CenterView, CnfsPermanenceProperties, MarkerEvent, MarkerProperties, StructurePresentation } from '../../models';
import {
  CartographyPresenter,
  coordinatesToCenterView,
  isCnfsPermanence,
  permanenceMarkerEventToCenterView,
  regionMarkerEventToCenterView
} from './cartography.presenter';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject, tap } from 'rxjs';
import { CnfsByRegionProperties, Coordinates } from '../../../../core';
import { ViewBox, ViewReset } from '../../directives/leaflet-map-state-change';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN } from '../../../configuration';
import { FeatureCollection, Point } from 'geojson';
import { mapPositionsToMarkers } from '../../models/markers/markers.presentation-mapper';
import { catchError, map } from 'rxjs/operators';

// TODO Inject though configuration token
const DEFAULT_VIEW_BOX: ViewBox = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  boundingBox: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

export const SPLIT_REGION_ZOOM: number = 8;
const SPLIT_DEPARTEMENT_ZOOM: number = 10;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
export class CartographyPage {
  private readonly _addressToGeocode$: Subject<string> = new Subject<string>();

  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  private readonly _viewBox$: Subject<ViewBox> = new BehaviorSubject<ViewBox>(DEFAULT_VIEW_BOX);

  private readonly _visibleMapPositions$: Observable<
    FeatureCollection<Point, CnfsByRegionProperties | CnfsPermanenceProperties>
  > = combineLatest([
    this.presenter.listCnfsByRegionPositions$(),
    this.presenter.listCnfsByDepartementPositions$(),
    this.presenter.listCnfsPositions$(this._viewBox$),
    this._viewBox$ as Observable<ViewBox>
  ]).pipe(
    map(
      ([byRegionPosition, byDepartementPosition, allCnfsPosition, viewBox]: [
        FeatureCollection<Point, CnfsByRegionProperties>,
        FeatureCollection<Point, CnfsByDepartementProperties>,
        FeatureCollection<Point, CnfsPermanenceProperties>,
        ViewBox
      ]): FeatureCollection<Point, CnfsByRegionProperties | CnfsPermanenceProperties> =>
        viewBox.zoomLevel < SPLIT_REGION_ZOOM ? byRegionPosition : allCnfsPosition
    )
  );

  public centerView: CenterView = this.cartographyConfiguration;

  public hasAddressError: boolean = false;

  public readonly usagerCoordinates$: Observable<Coordinates | null> = merge(
    this.presenter.geocodeAddress$(this._addressToGeocode$),
    this._usagerCoordinates$
  ).pipe(
    tap((coordinates: Coordinates): void => {
      this.centerView = coordinatesToCenterView(coordinates);
    }),
    catchError((): Observable<null> => {
      this.hasAddressError = true;
      return of(null);
    })
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public structuresList$: Observable<StructurePresentation[]> = this.presenter.structuresList$(
    this._viewBox$,
    this._visibleMapPositions$
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly visibleMarkers$: Observable<
    FeatureCollection<Point, MarkerProperties<CnfsByRegionProperties | CnfsPermanenceProperties>>
  > = this._visibleMapPositions$.pipe(map(mapPositionsToMarkers));

  public constructor(
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  public autoLocateUsagerRequest(coordinates: Coordinates): void {
    this._usagerCoordinates$.next(coordinates);
  }

  public geocodeUsagerRequest(address: string): void {
    this._addressToGeocode$.next(address);
  }

  public mapViewChanged($event: ViewReset): void {
    this._viewBox$.next({ boundingBox: $event.boundingBox, zoomLevel: $event.zoomLevel });
  }

  public onMarkerChanged(markerEvent: MarkerEvent<CnfsByRegionProperties | CnfsPermanenceProperties>): void {
    this.centerView = isCnfsPermanence(markerEvent.markerProperties)
      ? permanenceMarkerEventToCenterView(markerEvent as MarkerEvent<CnfsPermanenceProperties>)
      : regionMarkerEventToCenterView(markerEvent as MarkerEvent<CnfsByRegionProperties>);
  }
}
