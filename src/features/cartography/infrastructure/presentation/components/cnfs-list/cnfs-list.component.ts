import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { StructurePresentation } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  templateUrl: './cnfs-list.component.html'
})
export class CnfsListComponent {
  @Output() public readonly displayDetails: EventEmitter<void> = new EventEmitter<void>();

  @Input() public structuresList: StructurePresentation[] = [];

  public trackByStructureAddress(_: number, structurePresentation: StructurePresentation): string {
    return structurePresentation.address;
  }
}
