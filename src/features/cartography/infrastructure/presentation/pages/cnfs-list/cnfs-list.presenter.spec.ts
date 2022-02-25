import { CnfsListPresenter } from './cnfs-list.presenter';
import DoneCallback = jest.DoneCallback;

describe('cnfs list presenter', (): void => {
  // eslint-disable-next-line jest/no-done-callback
  it('should set structure id hint', (done: DoneCallback): void => {
    const presenter: CnfsListPresenter = new CnfsListPresenter();
    const structureId: string = '88bc36fb0db191928330b1e6';

    // eslint-disable-next-line rxjs/no-subscribe-handlers
    presenter.hint$.subscribe((structureIdHint: string): void => {
      expect(structureIdHint).toBe(structureId);
      done();
    });

    presenter.hint(structureId);
  });
});
