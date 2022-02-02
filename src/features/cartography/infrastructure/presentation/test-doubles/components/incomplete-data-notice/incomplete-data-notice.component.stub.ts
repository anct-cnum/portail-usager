import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'incomplete-data-notice',
  template: ''
})
export class IncompleteDataNoticeStubComponent {
  @Input() public displayDetailsStructureId?: string;

  @Input() public displayMap?: boolean;
}
