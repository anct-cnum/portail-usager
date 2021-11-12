import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { MapOptionsPresentation } from '../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'leaflet-map',
  template: ''
})
export class LeafletMapStubComponent {
  @Input() public mapOptions!: MapOptionsPresentation;
}
