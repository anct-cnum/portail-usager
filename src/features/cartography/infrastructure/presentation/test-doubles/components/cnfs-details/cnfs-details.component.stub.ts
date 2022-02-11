import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CnfsDetailsPresentation, CnfsPresentation, Opening } from '../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-details',
  template: ''
})
export class CnfsDetailsStubComponent {
  @Input() public access?: string;

  @Input() public address?: string;

  @Output() public readonly backToList: EventEmitter<void> = new EventEmitter<void>();

  @Input() public cnfsDetails?: CnfsDetailsPresentation | null;

  @Input() public cnfsList: CnfsPresentation[] = [];

  @Input() public cnfsTypeNote?: string;

  @Input() public distance?: string;

  @Input() public email?: string;

  @Input() public opening: Opening[] = [];

  @Input() public phone?: string;

  @Input() public structureName: string = '';

  @Input() public website?: string;
}
