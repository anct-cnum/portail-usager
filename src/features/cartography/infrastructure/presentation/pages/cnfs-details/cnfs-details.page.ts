import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { CnfsDetailsPresentation } from '../../models';
import { map } from 'rxjs/operators';
import { Coordinates } from '../../../../core';
import { CartographyPresenter } from '../cartography';
import { CARTOGRAPHY_TOKEN, CartographyConfiguration } from '../../../configuration';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CITY_ZOOM_LEVEL } from '../../helpers/map-constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cnfs-details.page.html'
})
export class CnfsDetailsPage implements OnInit {
  private readonly _structureId$: Observable<string> = this.route.paramMap.pipe(
    map((params: ParamMap): string | null => params.get('structureId')),
    filter((structureId: string | null): structureId is string => structureId !== null),
    tap((structureId: string): void => this.presenter.focusStructure(structureId))
  );

  public cnfsDetails$: Observable<CnfsDetailsPresentation | null> = this._structureId$.pipe(
    switchMap(
      (id: string | null): Observable<CnfsDetailsPresentation | null> =>
        id == null ? of(null) : this.cnfsDetailsWithUsagerMarker$(id)
    ),
    tap((cnfsDetailsPresentation: CnfsDetailsPresentation | null): void => {
      cnfsDetailsPresentation?.coordinates != null &&
        this.presenter.setMapView(cnfsDetailsPresentation.coordinates, CITY_ZOOM_LEVEL);
    })
  );

  public readonly structureId$: Observable<string> = this._structureId$;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  private cnfsDetailsWithUsagerMarker$(id: string, coordinates?: Coordinates): Observable<CnfsDetailsPresentation> {
    return coordinates == null ? this.presenter.cnfsDetails$(id) : this.presenter.cnfsDetails$(id, coordinates);
  }

  public ngOnInit(): void {
    this.presenter.setStructureDetailsDisplay(true);
  }

  public printCnfsDetails(): void {
    window.print();
  }
}
