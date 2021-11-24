// TODO REVIEW IGNORE
/* eslint-disable */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { CnfsPresentation, MapOptionsPresentation } from '../../models';
import { CartographyPresenter } from './cartography.presenter';
import type { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';

import type { CnfsTransfer } from '../../../data/models';
import { cnfsData } from '../../../../use-cases/test-doubles/data/cnfs-data';
import { Coordinates } from '../../../../core';

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

  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  private _presentation: CnfsPresentation = FIRST_MARKERS;

  public readonly cnfsMarkers$: Observable<CnfsPresentation> = this._cnfsMarkers$.asObservable();

  public readonly usagerCoordinates$: Observable<Coordinates> = this._usagerCoordinates$.asObservable();

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

  public geocodeUsagerPosition($event: string) {
    this.presenter.geocodeAddress$($event).subscribe((usagerCoordinates: Coordinates): void => {
      this._usagerCoordinates$.next(usagerCoordinates);
    });
  }
}
