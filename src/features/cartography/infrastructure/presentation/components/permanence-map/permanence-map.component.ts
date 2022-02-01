import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CenterView,
  CnfsByDepartmentMarkerProperties,
  CnfsByRegionMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  UsagerMarkerProperties
} from '../../models';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Coordinates } from '../../../../core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewReset } from '../../directives';
import { MARKERS, MARKERS_TOKEN } from '../../../configuration';

// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LONGITUDE: number = 4.468874066180609;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LATITUDE: number = 46.28146057911664;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_ZOOM_LEVEL: number = 6;

const DEFAULT_CENTER_VIEW: CenterView = {
  coordinates: new Coordinates(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
  zoomLevel: DEFAULT_ZOOM_LEVEL
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MARKERS_TOKEN,
      useValue: MARKERS
    }
  ],
  selector: 'permanence-map',
  templateUrl: './permanence-map.component.html'
})
export class PermanenceMapComponent {
  private readonly _centerView$: BehaviorSubject<CenterView> = new BehaviorSubject<CenterView>(DEFAULT_CENTER_VIEW);

  public defaultCenterView: CenterView = {
    coordinates: new Coordinates(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
    zoomLevel: DEFAULT_ZOOM_LEVEL
  };

  // TODO Utiliser startwith pour éviter la valeur par défault.
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public centerView$: Observable<CenterView> = this._centerView$.asObservable();

  @Output() public readonly cnfsDepartementMarkerChange: EventEmitter<MarkerEvent<CnfsByDepartmentMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsByDepartmentMarkerProperties>>();

  @Input() public cnfsDepartementMarkers: FeatureCollection<Point, CnfsByDepartmentMarkerProperties> | null = null;

  @Output() public readonly cnfsPermanenceMarkerChange: EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>>();

  @Input() public cnfsPermanenceMarkers: FeatureCollection<Point, CnfsPermanenceMarkerProperties> | null = null;

  @Output() public readonly cnfsRegionMarkerChange: EventEmitter<MarkerEvent<CnfsByRegionMarkerProperties>> = new EventEmitter<
    MarkerEvent<CnfsByRegionMarkerProperties>
  >();

  @Input() public cnfsRegionMarkers: FeatureCollection<Point, CnfsByRegionMarkerProperties> | null = null;

  @Output() public readonly displayDetails: EventEmitter<string> = new EventEmitter<string>();


  @Input() public highlightedStructureId: string | null = null;

  @Output() public readonly stateChange: EventEmitter<ViewReset> = new EventEmitter<ViewReset>();

  @Input() public usagerMarker: Feature<Point, UsagerMarkerProperties> | null = null;

  @Output() public readonly zoomOut: EventEmitter<void> = new EventEmitter<void>();

  @Input() public set centerView(centerView: CenterView) {
    this._centerView$.next(centerView);
  }

  public onDepartementClick(cnfsByDepartementMarkerEvent: MarkerEvent<CnfsByDepartmentMarkerProperties>): void {
    this.cnfsDepartementMarkerChange.emit(cnfsByDepartementMarkerEvent);
  }

  public onPermanenceClick(cnfsPermanenceMarkerEvent: MarkerEvent<CnfsPermanenceMarkerProperties>): void {
    this.cnfsPermanenceMarkerChange.emit(cnfsPermanenceMarkerEvent);
  }

  public onRegionClick(cnfsByRegionMarkerEvent: MarkerEvent<CnfsByRegionMarkerProperties>): void {
    this.cnfsRegionMarkerChange.emit(cnfsByRegionMarkerEvent);
  }

  public onStateChanged(viewReset: ViewReset): void {
    this.stateChange.emit(viewReset);
  }

  public trackByDepartementName(_: number, cnfsDepartemenFeature: Feature<Point, CnfsByDepartmentMarkerProperties>): string {
    return cnfsDepartemenFeature.properties.code;
  }

  public trackByPermanenceId(_: number, cnfsPermanenceFeature: Feature<Point, CnfsPermanenceMarkerProperties>): string {
    return cnfsPermanenceFeature.properties.id;
  }

  public trackByRegionName(_: number, cnfsRegionFeature: Feature<Point, CnfsByRegionMarkerProperties>): string {
    return cnfsRegionFeature.properties.region;
  }
}
