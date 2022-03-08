import { iif, map, Observable, of } from 'rxjs';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegionMarkerProperties, listCnfsByRegionToPresentation, MarkerProperties } from '../../models';
import { share } from 'rxjs/operators';
import { MarkerKey } from '../../../configuration';
import { CnfsByRegionProperties } from '../../../../core';
import { ObservableCache } from '../../helpers/observable-cache';
import { Inject, Injectable } from '@angular/core';
import { ListCnfsByRegionUseCase } from '../../../../use-cases';
import { getMarkerToDisplay, MapChange, toFeatureCollection } from './permanence-map.utils';

export type CnfsByRegionFeatureCollection = FeatureCollection<Point, CnfsByRegionMarkerProperties>;

@Injectable()
export class RegionPermanenceMapPresenter {
  private readonly _cnfsByRegion$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
    this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation), share());

  private readonly _markersRegionCache: ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey>();

  public constructor(@Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase) {}

  private cnfsByRegionOrEmpty$(markerTypeToDisplay: MarkerKey): Observable<Feature<Point, CnfsByRegionMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsByRegion,
      this._markersRegionCache.request$(this._cnfsByRegion$, MarkerKey.CnfsByRegion),
      of([])
    );
  }

  public markers$([viewportAndZoom, forceCnfsPermanence]: MapChange): Observable<CnfsByRegionFeatureCollection> {
    return this.cnfsByRegionOrEmpty$(getMarkerToDisplay(forceCnfsPermanence, viewportAndZoom)).pipe(map(toFeatureCollection));
  }
}
