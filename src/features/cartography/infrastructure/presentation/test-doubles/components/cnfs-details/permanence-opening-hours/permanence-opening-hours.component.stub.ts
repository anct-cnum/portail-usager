import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Opening } from '../../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-opening-hours',
  template: ''
})
export class PermanenceOpeningHoursStubComponent {
  @Input() public opening: Opening[] = [];
}
