import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CnfsPresentation } from '../../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-cnfs-info',
  template: ''
})
export class PermanenceCnfsInfoStubComponent {
  @Input() public cnfsList: CnfsPresentation[] = [];
}
