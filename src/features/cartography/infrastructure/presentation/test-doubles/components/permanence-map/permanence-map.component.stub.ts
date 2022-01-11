import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatureCollection, Point } from 'geojson';
import {
  CenterView,
  CnfsLocalityMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  PointOfInterestMarkerProperties,
  TypedMarker
} from '../../../models';
import { ViewReset } from '../../../directives/leaflet-map-state-change';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-map',
  template: ''
})
export class PermanenceMapStubComponent {
  @Input() public centerView!: CenterView;

  @Output() public readonly cnfsLocalityMarkerChange: EventEmitter<MarkerEvent<CnfsLocalityMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsLocalityMarkerProperties>>();

  @Output() public readonly cnfsPermanenceMarkerChange: EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>>();

  @Input() public highlightedStructureId: string | null = null;

  @Input() public markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> | null = null;

  @Output() public readonly stateChange: EventEmitter<ViewReset> = new EventEmitter<ViewReset>();
}
