import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { StructurePresentation } from '../../models';

const shouldHighlight = (featuredStructureIdChange: SimpleChange | undefined): boolean =>
  !(featuredStructureIdChange?.firstChange ?? true);

const shouldReplayHighlight = (featuredStructureIdChange: SimpleChange | undefined): boolean =>
  featuredStructureIdChange?.currentValue === 'replay';

const currentValue = <T>(simpleChange: SimpleChange | undefined): T => simpleChange?.currentValue as T;

const previousValue = <T>(simpleChange: SimpleChange | undefined): T => simpleChange?.previousValue as T;

const SCROLL_DELAY_IN_MILLISECONDS: number = 400;

const highlight = (structureId: string): string => {
  const elem: HTMLElement | null = document.getElementById(structureId);
  if (elem == null) return structureId;

  setTimeout((): void => {
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, SCROLL_DELAY_IN_MILLISECONDS);

  return structureId;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  templateUrl: './cnfs-list.component.html'
})
export class CnfsListComponent implements OnChanges {
  @Input() public focusStructureId: string | null = null;

  @Input() public hintStructureId: string | null = null;

  @Output() public readonly structureEnter: EventEmitter<string> = new EventEmitter<string>();

  @Output() public readonly structureLeave: EventEmitter<void> = new EventEmitter<void>();

  @Input() public structuresList: StructurePresentation[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    shouldHighlight(changes['highlightedStructureId']) && highlight(currentValue<string>(changes['highlightedStructureId']));
    shouldReplayHighlight(changes['highlightedStructureId']) &&
      (this.focusStructureId = highlight(previousValue<string>(changes['highlightedStructureId'])));
  }

  public trackByStructureId(_: number, structure: StructurePresentation): string {
    return structure.id;
  }
}
