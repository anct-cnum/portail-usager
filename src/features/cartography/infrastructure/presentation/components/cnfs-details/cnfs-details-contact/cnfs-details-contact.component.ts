import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-details-contact',
  templateUrl: './cnfs-details-contact.component.html'
})
export class CnfsDetailsContactComponent {
  @Input() public email?: string;

  @Input() public phone?: string;

  @Input() public website?: string;
}
