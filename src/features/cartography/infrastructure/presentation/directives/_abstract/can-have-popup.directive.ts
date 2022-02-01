import { Directive } from '@angular/core';

@Directive()
export abstract class CanHavePopupDirective<T> {
  public abstract get popupHolder(): T | undefined;
}
