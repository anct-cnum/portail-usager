import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CenterView,
  CnfsLocalityMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  PointOfInterestMarkerProperties,
  TypedMarker
} from '../../models';
import { ViewReset } from '../../directives/leaflet-map-state-change';
import { FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-map',
  templateUrl: './permanence-map.component.html'
})
export class PermanenceMapComponent {
  @Input() public centerView!: CenterView;

  @Output() public readonly cnfsLocalityMarkerChange: EventEmitter<MarkerEvent<CnfsLocalityMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsLocalityMarkerProperties>>();

  @Output() public readonly cnfsPermanenceMarkerChange: EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>>();

  @Input() public markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> | null = null;

  @Output() public readonly stateChange: EventEmitter<ViewReset> = new EventEmitter<ViewReset>();

  @Output() public readonly zoomOut: EventEmitter<void> = new EventEmitter<void>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly _markerChangedMap: Map<Marker, EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>> = new Map<
    Marker,
    EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>
  >([
    [Marker.CnfsPermanence, this.cnfsPermanenceMarkerChange as EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>],
    [Marker.CnfsByRegion, this.cnfsLocalityMarkerChange as EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>],
    [Marker.CnfsByDepartment, this.cnfsLocalityMarkerChange as EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>>]
  ]);

  public onMarkerChanged(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    this._markerChangedMap.get(markerEvent.markerProperties.markerType)?.emit(markerEvent);
  }

  public onStateChanged(viewReset: ViewReset): void {
    this.stateChange.emit(viewReset);
  }
}
