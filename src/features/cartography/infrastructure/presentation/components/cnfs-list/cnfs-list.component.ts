import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { StructurePresentation } from '../../models';

const SCROLL_DELAY_IN_MILLISECONDS: number = 400;

const highlight = (structureId: string = ''): void => {
  document.getElementById(structureId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  templateUrl: './cnfs-list.component.html'
})
export class CnfsListComponent {
  public _structuresList: StructurePresentation[] = [];

  @Input() public focusStructureId?: string;

  @Input() public hintStructureId: string | null = null;

  @Output() public readonly structureEnter: EventEmitter<string> = new EventEmitter<string>();

  @Output() public readonly structureLeave: EventEmitter<void> = new EventEmitter<void>();

  public get structuresList(): StructurePresentation[] {
    return this._structuresList;
  }

  @Input() public set structuresList(structuresList: StructurePresentation[]) {
    this._structuresList = structuresList;

    setTimeout((): void => {
      highlight(this.focusStructureId);
    }, SCROLL_DELAY_IN_MILLISECONDS);
  }

  public trackByStructureId(_: number, structure: StructurePresentation): string {
    return structure.id;
  }
}
