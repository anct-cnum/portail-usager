import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'incomplete-data-notice',
  templateUrl: './incomplete-data-notice.component.html'
})
export class IncompleteDataNoticeComponent {
  public isOpen: boolean = true;
}
