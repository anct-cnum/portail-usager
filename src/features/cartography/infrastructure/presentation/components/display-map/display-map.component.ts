import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'display-map',
  templateUrl: './display-map.component.html'
})
export class DisplayMapComponent {
  public displayMapControl: FormControl = new FormControl(false);

  @Output() public readonly displayMap: EventEmitter<boolean> = new EventEmitter<boolean>();
}
