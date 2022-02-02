import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'incomplete-data-notice',
  templateUrl: './incomplete-data-notice.component.html'
})
export class IncompleteDataNoticeComponent {
  public isOpen: boolean = true;

  @Input() public displayDetailsStructureId: string | null = null;

  @Input() public displayMap: boolean = false;
}
