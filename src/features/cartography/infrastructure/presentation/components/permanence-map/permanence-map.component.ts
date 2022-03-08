import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CenterView,
  CnfsByDepartmentMarkerProperties,
  CnfsByRegionMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  PointOfInterestMarkerProperties,
  UsagerMarkerProperties
} from '../../models';
import { Feature, FeatureCollection, Point } from 'geojson';
import { ViewportAndZoom, ViewReset } from '../../directives';
import { MARKERS, MARKERS_TOKEN } from '../../../configuration';
import { CartographyPresenter, HighlightedStructure } from '../../pages';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DepartmentPermanenceMapPresenter } from './department-permanence-map.presenter';
import { RegionPermanenceMapPresenter } from './region-permanence-map.presenter';
import { CnfsPermanenceMapPresenter } from './cnfs-permanence-map.presenter';
import { CnfsByDepartmentProperties, CnfsByRegionProperties } from '../../../../core';

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

  public readonly departementMarkers$: Observable<FeatureCollection<Point, CnfsByDepartmentMarkerProperties>> =
    this.departmentPermanenceMapPresenter.visibleMapCnfsByDepartmentAtZoomLevel$(this._forceCnfsPermanence$.asObservable());

  public readonly permanenceMarkers$: Observable<FeatureCollection<Point, CnfsPermanenceMarkerProperties>> =
    this.cnfsPermanenceMapPresenter
      .visibleMapCnfsPermanencesThroughViewportAtZoomLevel$(this._forceCnfsPermanence$.asObservable())
      .pipe(
        tap((cnfsPermanences: FeatureCollection<Point, CnfsPermanenceMarkerProperties>): void =>
          this.cartographyPresenter.setCnfsPermanences(cnfsPermanences.features.map(toCnfsPermanenceProperties))
        )
      );

  public readonly regionMarkers$: Observable<FeatureCollection<Point, CnfsByRegionMarkerProperties>> =
    this.regionPermanenceMapPresenter.visibleMapCnfsByRegionAtZoomLevel$(this._forceCnfsPermanence$.asObservable());

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

  public onDepartementClick(cnfsByDepartementMarkerEvent: MarkerEvent<CnfsByDepartmentMarkerProperties>): void {
    this._forceCnfsPermanence$.next(isGuyaneBoundedMarker(cnfsByDepartementMarkerEvent.markerProperties));
    this.cartographyPresenter.setMapView(
      cnfsByDepartementMarkerEvent.markerPosition,
      cnfsByDepartementMarkerEvent.markerProperties.boundingZoom
    );
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

  public onRegionClick(cnfsByRegionMarkerEvent: MarkerEvent<CnfsByRegionMarkerProperties>): void {
    this._forceCnfsPermanence$.next(isGuyaneBoundedMarker(cnfsByRegionMarkerEvent.markerProperties));
    this.cartographyPresenter.setMapView(
      cnfsByRegionMarkerEvent.markerPosition,
      cnfsByRegionMarkerEvent.markerProperties.boundingZoom
    );
  }

  public onStateChanged(viewReset: ViewReset): void {
    const viewportAndZoom: ViewportAndZoom = {
      viewport: viewReset.viewport,
      zoomLevel: viewReset.zoomLevel
    };

    this.departmentPermanenceMapPresenter.setViewportAndZoom(viewportAndZoom);
    this.regionPermanenceMapPresenter.setViewportAndZoom(viewportAndZoom);
    this.cnfsPermanenceMapPresenter.setViewportAndZoom(viewportAndZoom);
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
