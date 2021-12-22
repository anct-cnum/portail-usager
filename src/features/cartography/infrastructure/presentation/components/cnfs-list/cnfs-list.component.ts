import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StructurePresentation } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  templateUrl: './cnfs-list.component.html'
})
export class CnfsListComponent {
  @Input() public listStructures: StructurePresentation[] = [];

  public trackByStructureAddress(_: number, structurePresentation: StructurePresentation): string {
    return structurePresentation.address;
  }
}
