import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Opening } from '../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-opening-hours',
  templateUrl: './permanence-opening-hours.component.html'
})
export class PermanenceOpeningHoursComponent {
  @Input() public opening: Opening[] = [];

  public trackByOpeningDay(_: number, opening: Opening): string {
    return opening.day;
  }
}
