import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-menu',
  template: ''
})
export class MenuStubComponent {
  @Input() public expanded: boolean = false;

  @Input() public label: string = '';
}
