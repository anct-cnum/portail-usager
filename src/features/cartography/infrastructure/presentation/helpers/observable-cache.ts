import { AsyncSubject, Observable, tap } from 'rxjs';

export class ObservableCache<T, U extends string = string> {
  private readonly _cache: Map<U, AsyncSubject<T>> = new Map<U, AsyncSubject<T>>();

  public request$ = (observable$: Observable<T>, cacheKey: U): Observable<T> =>
    this._cache.get(cacheKey)?.asObservable() ??
    observable$.pipe(
      tap((observable: T): void => {
        const subject$: AsyncSubject<T> = new AsyncSubject<T>();
        subject$.next(observable);
        subject$.complete();
        this._cache.set(cacheKey, subject$);
      })
    );
}
