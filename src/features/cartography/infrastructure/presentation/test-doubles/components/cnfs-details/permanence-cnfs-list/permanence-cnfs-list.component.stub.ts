import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CnfsPresentation } from '../../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-cnfs-list',
  template: ''
})
export class PermanenceCnfsListStubComponent {
  @Input() public cnfsList: CnfsPresentation[] = [];
}
