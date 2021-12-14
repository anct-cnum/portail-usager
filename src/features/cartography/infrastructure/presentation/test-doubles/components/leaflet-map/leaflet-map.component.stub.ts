import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CartographyConfiguration } from '../../../../configuration';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'leaflet-map',
  template: ''
})
export class LeafletMapStubComponent {
  @Input() public mapOptions!: CartographyConfiguration;
}
