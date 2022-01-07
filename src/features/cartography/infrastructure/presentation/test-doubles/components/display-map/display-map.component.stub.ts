import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'display-map',
  template: ''
})
export class DisplayMapStubComponent {
  @Output() public readonly displayMap: EventEmitter<boolean> = new EventEmitter<boolean>();
}
