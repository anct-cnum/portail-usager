import { iif, map, Observable, of } from 'rxjs';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByDepartmentMarkerProperties, cnfsByDepartmentToPresentation, MarkerProperties } from '../../models';
import { share } from 'rxjs/operators';
import { MarkerKey } from '../../../configuration';
import { CnfsByDepartmentProperties } from '../../../../core';
import { ObservableCache } from '../../helpers/observable-cache';
import { Inject, Injectable } from '@angular/core';
import { ListCnfsByDepartmentUseCase } from '../../../../use-cases';
import { getMarkerToDisplay, MapChange, toFeatureCollection } from './permanence-map.utils';

export type CnfsByDepartmentFeatureCollection = FeatureCollection<Point, CnfsByDepartmentMarkerProperties>;

@Injectable()
export class DepartmentPermanenceMapPresenter {
  private readonly _cnfsByDepartment$: Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> =
    this.listCnfsByDepartmentUseCase.execute$().pipe(map(cnfsByDepartmentToPresentation), share());

  private readonly _markersDepartmentCache: ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey>();

  public constructor(
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase
  ) {}

  private cnfsByDepartmentOrEmpty$(
    markerTypeToDisplay: MarkerKey
  ): Observable<Feature<Point, CnfsByDepartmentMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsByDepartment,
      this._markersDepartmentCache.request$(this._cnfsByDepartment$, MarkerKey.CnfsByDepartment),
      of([])
    );
  }

  public markers$([viewportAndZoom, forceCnfsPermanence]: MapChange): Observable<CnfsByDepartmentFeatureCollection> {
    return this.cnfsByDepartmentOrEmpty$(getMarkerToDisplay(forceCnfsPermanence, viewportAndZoom)).pipe(
      map(toFeatureCollection)
    );
  }
}
