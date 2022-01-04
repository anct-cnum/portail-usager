import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CnfsDetailsPresentation, Opening } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-details',
  templateUrl: './cnfs-details.component.html'
})
export class CnfsDetailsComponent {
  @Output() public readonly backToList: EventEmitter<void> = new EventEmitter<void>();

  @Input() public cnfsDetails?: CnfsDetailsPresentation | null;

  public trackByOpeningDay(_: number, opening: Opening): string {
    return opening.day;
  }
}
