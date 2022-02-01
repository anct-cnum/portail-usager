import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'switch-map-list',
  template: ''
})
export class SwitchMapListStubComponent {
  @Output() public readonly displayMap: EventEmitter<boolean> = new EventEmitter<boolean>();
}
