import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GeoJsonProperties } from 'geojson';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  template: ''
})
export class CnfsListStubComponent {
  @Input() public list!: GeoJsonProperties[];
}
