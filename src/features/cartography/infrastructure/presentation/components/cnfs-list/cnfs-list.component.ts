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

const SCROLL_DELAY_IN_MILLISECONDS: number = 50;

const highlight = (structureId: string): string => {
  const elem: HTMLElement | null = document.getElementById(structureId);
  if (elem == null) return structureId;

  setTimeout((): void => {
    elem.scrollIntoView({ behavior: 'smooth' });
  }, SCROLL_DELAY_IN_MILLISECONDS);

  return structureId;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-list',
  templateUrl: './cnfs-list.component.html'
})
export class CnfsListComponent implements OnChanges {
  @Output() public readonly displayDetails: EventEmitter<string> = new EventEmitter<string>();

  @Input() public highlightedStructureId: string | null = null;

  @Input() public structuresList: StructurePresentation[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    shouldHighlight(changes['highlightedStructureId']) && highlight(currentValue<string>(changes['highlightedStructureId']));
    shouldReplayHighlight(changes['highlightedStructureId']) &&
      (this.highlightedStructureId = highlight(previousValue<string>(changes['highlightedStructureId'])));
  }

  public trackByStructureId(_: number, structure: StructurePresentation): string {
    return structure.id;
  }
}
