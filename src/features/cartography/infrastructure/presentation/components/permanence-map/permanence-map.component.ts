import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CenterView,
  CnfsByDepartmentMarkerProperties,
  CnfsByRegionMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  UsagerMarkerProperties
} from '../../models';
import { Feature, Point } from 'geojson';
import { ViewportAndZoom, ViewReset } from '../../directives';
import { MARKERS, MARKERS_TOKEN } from '../../../configuration';
import { CartographyPresenter, HighlightedStructure } from '../../pages';
import { BehaviorSubject, combineLatest, Observable, switchMap, tap } from 'rxjs';
import { CnfsByDepartmentFeatureCollection, DepartmentPermanenceMapPresenter } from './department-permanence-map.presenter';
import { CnfsByRegionFeatureCollection, RegionPermanenceMapPresenter } from './region-permanence-map.presenter';
import { CnfsPermanenceFeatureCollection, CnfsPermanenceMapPresenter } from './cnfs-permanence-map.presenter';
import { CnfsByDepartmentProperties, CnfsByRegionProperties } from '../../../../core';
import { MapChange } from './permanence-map.utils';

// todo: export in configuration
const DEFAULT_MAP_VIEWPORT_AND_ZOOM: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const isGuyaneBoundedMarker = (markerProperties: PointOfInterestMarkerProperties): boolean => {
  const departementProperties: CnfsByDepartmentProperties = markerProperties as CnfsByDepartmentProperties;
  const regionProperties: CnfsByRegionProperties = markerProperties as CnfsByRegionProperties;

  return departementProperties.department === 'Guyane' || regionProperties.region === 'Guyane';
};

const toCnfsPermanenceProperties = (
  cnfsPermanence: Feature<Point, CnfsPermanenceMarkerProperties>
): CnfsPermanenceMarkerProperties => cnfsPermanence.properties;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DepartmentPermanenceMapPresenter,
    RegionPermanenceMapPresenter,
    CnfsPermanenceMapPresenter,
    {
      provide: MARKERS_TOKEN,
      useValue: MARKERS
    }
  ],
  selector: 'permanence-map',
  templateUrl: './permanence-map.component.html'
})
export class PermanenceMapComponent {
  private readonly _forceCnfsPermanence$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly _viewportAndZoom$: BehaviorSubject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly _mapChange$: Observable<MapChange> = combineLatest([this._viewportAndZoom$, this._forceCnfsPermanence$]);

  public readonly departementMarkers$: Observable<CnfsByDepartmentFeatureCollection> = this._mapChange$.pipe(
    switchMap(
      (mapChange: MapChange): Observable<CnfsByDepartmentFeatureCollection> =>
        this.departmentPermanenceMapPresenter.markers$(mapChange)
    )
  );

  public readonly permanenceMarkers$: Observable<CnfsPermanenceFeatureCollection> = this._mapChange$.pipe(
    switchMap(
      (mapChange: MapChange): Observable<CnfsPermanenceFeatureCollection> => this.cnfsPermanenceMapPresenter.markers$(mapChange)
    ),
    tap((cnfsPermanences: CnfsPermanenceFeatureCollection): void =>
      this.cartographyPresenter.setCnfsPermanences(cnfsPermanences.features.map(toCnfsPermanenceProperties))
    )
  );

  public readonly regionMarkers$: Observable<CnfsByRegionFeatureCollection> = this._mapChange$.pipe(
    switchMap(
      (mapChange: MapChange): Observable<CnfsByRegionFeatureCollection> => this.regionPermanenceMapPresenter.markers$(mapChange)
    )
  );

  @Input() public centerView!: CenterView;

  @Output() public readonly cnfsPermanenceMarkerClick: EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>>();

  @Output() public readonly cnfsPermanenceMarkerEnter: EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>>();

  @Output() public readonly cnfsPermanenceMarkerLeave: EventEmitter<void> = new EventEmitter<void>();

  @Input() public highlightedStructure?: HighlightedStructure;

  @Input() public usagerMarker: Feature<Point, UsagerMarkerProperties> | null = null;

  public constructor(
    private readonly cartographyPresenter: CartographyPresenter,
    private readonly cnfsPermanenceMapPresenter: CnfsPermanenceMapPresenter,
    private readonly departmentPermanenceMapPresenter: DepartmentPermanenceMapPresenter,
    private readonly regionPermanenceMapPresenter: RegionPermanenceMapPresenter
  ) {}

  public onLocationClick<T extends CnfsByDepartmentMarkerProperties | CnfsByRegionMarkerProperties>(
    locationMarkerEvent: MarkerEvent<MarkerProperties<T>>
  ): void {
    this._forceCnfsPermanence$.next(isGuyaneBoundedMarker(locationMarkerEvent.markerProperties));
    this.cartographyPresenter.setMapView(locationMarkerEvent.markerPosition, locationMarkerEvent.markerProperties.boundingZoom);
  }

  public onPermanenceClick(cnfsPermanenceMarkerEvent: MarkerEvent<CnfsPermanenceMarkerProperties>): void {
    this.cnfsPermanenceMarkerClick.emit(cnfsPermanenceMarkerEvent);
  }

  public onPermanenceEnter(cnfsPermanenceMarkerEvent: MarkerEvent<CnfsPermanenceMarkerProperties>): void {
    this.cnfsPermanenceMarkerEnter.emit(cnfsPermanenceMarkerEvent);
  }

  public onPermanenceLeave(): void {
    this.cnfsPermanenceMarkerLeave.emit();
  }

  public onStateChanged(viewReset: ViewReset): void {
    this._viewportAndZoom$.next(viewReset);
  }

  public onZoomOut(): void {
    this._forceCnfsPermanence$.next(false);
  }

  public trackByDepartementName(_: number, cnfsDepartementFeature: Feature<Point, CnfsByDepartmentMarkerProperties>): string {
    return cnfsDepartementFeature.properties.code;
  }

  public trackByPermanenceId(_: number, cnfsPermanenceFeature: Feature<Point, CnfsPermanenceMarkerProperties>): string {
    return cnfsPermanenceFeature.properties.id;
  }

  public trackByRegionName(_: number, cnfsRegionFeature: Feature<Point, CnfsByRegionMarkerProperties>): string {
    return cnfsRegionFeature.properties.region;
  }
}
