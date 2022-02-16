import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CnfsPresentation } from '../../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'permanence-cnfs-list',
  templateUrl: './permanence-cnfs-list.component.html'
})
export class PermanenceCnfsListComponent {
  @Input() public cnfsList: CnfsPresentation[] = [];

  public trackByCnfsFullName(_: number, cnfs: CnfsPresentation): string {
    return cnfs.fullName;
  }
}
