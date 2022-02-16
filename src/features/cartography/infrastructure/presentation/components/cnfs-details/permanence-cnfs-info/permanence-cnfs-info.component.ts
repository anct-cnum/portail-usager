import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CnfsPresentation } from '../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-cnfs-info',
  templateUrl: './permanence-cnfs-info.component.html'
})
export class PermanenceCnfsInfoComponent {
  @Input() public cnfsList: CnfsPresentation[] = [];
}
