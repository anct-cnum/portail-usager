import { AsyncSubject, Observable, tap } from 'rxjs';

export class ObservableCache<T> {
  private readonly _cache: Map<string, AsyncSubject<T>> = new Map<string, AsyncSubject<T>>();

  public request$ = (observable$: Observable<T>, cacheKey: string): Observable<T> =>
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
