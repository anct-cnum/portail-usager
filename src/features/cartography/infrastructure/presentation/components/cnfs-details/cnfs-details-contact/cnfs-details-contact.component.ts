import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-details-contact',
  templateUrl: './cnfs-details-contact.component.html'
})
export class CnfsDetailsContactComponent {
  @Input() public email?: string;

  @Input() public emailLabel?: string;

  @Input() public icons: boolean = true;

  @Input() public phone?: string;

  @Input() public size: 'md' | 'sm' = 'md';

  @Input() public website?: string;

  @Input() public websiteLabel?: string;
}
