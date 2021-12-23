import { Observable, Subject, take } from 'rxjs';
import { ObservableCache } from './observable-cache';

describe('Observable Cache', (): void => {
  // eslint-disable-next-line jest/no-done-callback
  it('should cache the observable, multiple observalble resolution having just one shared usecase call', (done: jest.DoneCallback): void => {
    const observableToCache$: Subject<number> = new Subject<number>();

    const cache: ObservableCache<number> = new ObservableCache<number>();

    const cachedRequestFirstTime$: Observable<number> = cache.request$(observableToCache$, 'key').pipe(take(1));

    // eslint-disable-next-line rxjs/no-subscribe-handlers
    cachedRequestFirstTime$.subscribe({
      next: (resolved: number): void => {
        expect(resolved).toBe(5);
      }
    });

    observableToCache$.next(5);

    const cachedRequestSecondTime$: Observable<number> = cache.request$(observableToCache$, 'key').pipe(take(3));

    // eslint-disable-next-line rxjs/no-subscribe-handlers
    cachedRequestSecondTime$.subscribe({
      complete: (): void => {
        done();
      },
      next: (resolved: number): void => {
        expect(resolved).toBe(5);
      }
    });

    observableToCache$.next(6);
  });
});
