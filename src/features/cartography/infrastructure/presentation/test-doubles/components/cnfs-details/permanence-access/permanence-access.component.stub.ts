import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-access',
  template: ''
})
export class PermanenceAccessStubComponent {
  @Input() public access?: string;
}
