import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-access',
  templateUrl: './permanence-access.component.html'
})
export class PermanenceAccessComponent {
  @Input() public access?: string;
}
