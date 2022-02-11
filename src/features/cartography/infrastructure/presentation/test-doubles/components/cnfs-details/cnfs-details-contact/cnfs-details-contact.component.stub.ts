import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-details-contact',
  template: ''
})
export class CnfsDetailsContactStubComponent {
  @Input() public email?: string;

  @Input() public emailLabel?: string;

  @Input() public icons: boolean = true;

  @Input() public phone?: string;

  @Input() public size: 'md' | 'sm' = 'md';

  @Input() public website?: string;
}
