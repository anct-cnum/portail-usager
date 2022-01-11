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

const highlight = (structureId: string): void => {
  const elem: HTMLElement | null = document.getElementById(structureId);
  if (elem == null) return;
  elem.scrollIntoView({ behavior: 'smooth' });
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
      highlight(previousValue<string>(changes['highlightedStructureId']));
  }

  public trackByPermanenceId(_: number, permanence: StructurePresentation): string {
    return permanence.id;
  }
}
