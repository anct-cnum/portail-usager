import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  CenterView,
  CnfsLocalityMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  PointOfInterestMarkerProperties,
  TypedMarker
} from '../../models';
import { ViewReset } from '../../directives/leaflet-map-state-change';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { LeafletMapComponent, TypedLeafletMarker } from '../leaflet-map/leaflet-map.component';
import { Coordinates } from '../../../../core';
import { CITY_ZOOM_LEVEL } from '../../helpers/map-constants';
import { BehaviorSubject, Observable } from 'rxjs';

// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LONGITUDE: number = 4.468874066180609;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LATITUDE: number = 46.28146057911664;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_ZOOM_LEVEL: number = 6;

const shouldHighlight = (featuredStructureIdChange: SimpleChange | undefined): boolean =>
  !(featuredStructureIdChange?.firstChange ?? true);

const currentValue = <T>(simpleChange: SimpleChange | undefined): T => simpleChange?.currentValue as T;

const DEFAULT_CENTER_VIEW: CenterView = {
  coordinates: new Coordinates(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
  zoomLevel: DEFAULT_ZOOM_LEVEL
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-map',
  templateUrl: './permanence-map.component.html'
})
export class PermanenceMapComponent implements OnChanges {
  private readonly _centerView$: BehaviorSubject<CenterView> = new BehaviorSubject<CenterView>(DEFAULT_CENTER_VIEW);

  public centerView$: Observable<CenterView> = this._centerView$.asObservable();

  public defaultCenterView: CenterView = {
    coordinates: new Coordinates(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
    zoomLevel: DEFAULT_ZOOM_LEVEL
  };

  @Output() public readonly cnfsLocalityMarkerChange: EventEmitter<MarkerEvent<CnfsLocalityMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsLocalityMarkerProperties>>();

  @Output() public readonly cnfsPermanenceMarkerChange: EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>>();

  @Input() public highlightedStructureId: string | null = null;

  @ViewChild(LeafletMapComponent) public leafletMap!: LeafletMapComponent;

  @Input() public markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> | null = null;

  @Output() public readonly stateChange: EventEmitter<ViewReset> = new EventEmitter<ViewReset>();

  @Output() public readonly zoomOut: EventEmitter<void> = new EventEmitter<void>();

  @Input() public set centerView(centerView: CenterView) {
    this._centerView$.next(centerView);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly _markerChangedMap: Map<Marker, EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>> = new Map<
    Marker,
    EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>
  >([
    [Marker.CnfsPermanence, this.cnfsPermanenceMarkerChange as EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>],
    [Marker.CnfsByRegion, this.cnfsLocalityMarkerChange as EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>],
    [Marker.CnfsByDepartment, this.cnfsLocalityMarkerChange as EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>]
  ]);

  private highlight(structureId: string): void {
    const markerFound: TypedLeafletMarker<Feature<Point, CnfsPermanenceMarkerProperties>> | undefined =
      this.leafletMap.findMarker(
        Marker.CnfsPermanence,
        (permMarker: Feature<Point, CnfsPermanenceMarkerProperties>): boolean => permMarker.properties.id === structureId
      );

    if (markerFound == null) return;

    this._centerView$.next({
      coordinates: Coordinates.fromGeoJsonFeature(markerFound.feature),
      zoomLevel: CITY_ZOOM_LEVEL
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    shouldHighlight(changes['highlightedStructureId']) &&
      this.highlight(currentValue<string>(changes['highlightedStructureId']));
  }

  public onMarkerChanged(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    this._markerChangedMap.get(markerEvent.markerProperties.markerType)?.emit(markerEvent);
  }

  public onStateChanged(viewReset: ViewReset): void {
    this.stateChange.emit(viewReset);
  }
}
