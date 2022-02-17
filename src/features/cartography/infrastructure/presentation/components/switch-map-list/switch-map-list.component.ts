import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'switch-map-list',
  templateUrl: './switch-map-list.component.html'
})
export class SwitchMapListComponent {
  @Input() public displayDetailsStructureId?: string;

  @Input() public displayMap: boolean = false;

  @Output() public readonly switchMapList: EventEmitter<boolean> = new EventEmitter<boolean>();

  public toggle(): void {
    this.displayMap = !this.displayMap;
    this.switchMapList.emit(this.displayMap);
  }
}
