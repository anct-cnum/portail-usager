import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CnfsPresentation, CnfsDetailsPresentation, Opening } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-details',
  templateUrl: './cnfs-details.component.html'
})
export class CnfsDetailsComponent {
  @Input() public access?: string;

  @Input() public address?: string;

  @Input() public cnfsDetails?: CnfsDetailsPresentation | null;

  @Input() public cnfsList: CnfsPresentation[] = [];

  @Input() public cnfsTypeNote?: string;

  @Input() public distance?: string;

  @Input() public email?: string;

  @Input() public isLabeledAidantsConnect?: boolean;

  @Input() public opening: Opening[] = [];

  @Input() public phone?: string;

  @Output() public readonly print: EventEmitter<void> = new EventEmitter<void>();

  @Input() public structureId: string = '';

  @Input() public structureName: string = '';

  @Input() public website?: string;
}
