import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-address',
  template: ''
})
export class PermanenceAddressStubComponent {
  @Input() public address?: string;

  @Input() public distance?: string;
}
