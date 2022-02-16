import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-address',
  templateUrl: './permanence-address.component.html'
})
export class PermanenceAddressComponent {
  @Input() public address?: string;

  @Input() public distance?: string;
}
