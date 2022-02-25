import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CnfsListPresenter {
  private readonly _hint$: Subject<string> = new Subject<string>();

  public hint$: Observable<string> = this._hint$.asObservable();

  public hint(structureId: string): void {
    this._hint$.next(structureId);
  }
}
