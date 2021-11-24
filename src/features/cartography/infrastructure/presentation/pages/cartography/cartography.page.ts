// TODO To remove as soon as possible
/* eslint-disable */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { CnfsPresentation, MapOptionsPresentation } from '../../models';
import { CartographyPresenter } from './cartography.presenter';
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import type { CnfsTransfer } from '../../../data/models';
import { cnfsData } from '../../../../use-cases/test-doubles/data/cnfs-data';

const CNFS_DATA: CnfsTransfer = cnfsData() as CnfsTransfer;

const FIRST_MARKERS: CnfsPresentation = {
  features: [CNFS_DATA.features[0], CNFS_DATA.features[1], CNFS_DATA.features[2]],
  type: 'FeatureCollection'
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
export class CartographyPage {
  private readonly _cnfsMarkers$: BehaviorSubject<CnfsPresentation> = new BehaviorSubject<CnfsPresentation>({
    features: [],
    type: 'FeatureCollection'
  });

  private _presentation: CnfsPresentation = FIRST_MARKERS;

  public readonly cnfsMarkers$: Observable<CnfsPresentation> = this._cnfsMarkers$.asObservable();

  public readonly mapOptions: MapOptionsPresentation;

  public constructor(private readonly presenter: CartographyPresenter) {
    this.mapOptions = this.presenter.defaultMapOptions();

    this.presenter.listCnfsPositions$().subscribe((cnfs: CnfsPresentation): void => {
      this._presentation = cnfs;
    });
    setTimeout((): void => {
      this._cnfsMarkers$.next(FIRST_MARKERS);
    }, 2000);

    setTimeout((): void => {
      this._cnfsMarkers$.next(this._presentation);
    }, 4000);
  }
}
