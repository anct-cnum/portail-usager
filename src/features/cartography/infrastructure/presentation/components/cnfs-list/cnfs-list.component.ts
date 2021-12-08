import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Feature, Point } from 'geojson';
import { MarkerProperties } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  templateUrl: './cnfs-list.component.html'
})
export class CnfsListComponent {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  @Input() public listConseillers: Feature<Point, MarkerProperties>[] = [];
}
