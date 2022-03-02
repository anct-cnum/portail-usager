import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { StructurePresentation } from '../../models';

const SCROLL_DELAY_IN_MILLISECONDS: number = 400;

const highlight = (structureId: string): void => {
  const elem: HTMLElement | null = document.getElementById(structureId);
  if (elem == null) return;

  setTimeout((): void => {
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, SCROLL_DELAY_IN_MILLISECONDS);
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  templateUrl: './cnfs-list.component.html'
})
export class CnfsListComponent {
  private _focusStructureId?: string;

  @Input() public hintStructureId: string | null = null;

  @Output() public readonly structureEnter: EventEmitter<string> = new EventEmitter<string>();

  @Output() public readonly structureLeave: EventEmitter<void> = new EventEmitter<void>();

  @Input() public structuresList: StructurePresentation[] = [];

  public get focusStructureId(): string {
    return this._focusStructureId ?? '';
  }

  @Input() public set focusStructureId(focusStructureId: string) {
    this._focusStructureId = focusStructureId;
    highlight(focusStructureId);
  }

  public trackByStructureId(_: number, structure: StructurePresentation): string {
    return structure.id;
  }
}
