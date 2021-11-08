import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map.page.html'
})
export class MapPage {}
