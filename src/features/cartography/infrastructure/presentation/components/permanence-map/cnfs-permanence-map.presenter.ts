import { iif, map, Observable, of } from 'rxjs';
import { Feature, FeatureCollection, Point } from 'geojson';
import {
  cnfsCoreToCnfsPermanenceFeatures,
  CnfsPermanenceMarkerProperties,
  CnfsPermanenceProperties,
  MarkerProperties,
  PointOfInterestMarkerProperties
} from '../../models';
import { share } from 'rxjs/operators';
import { ViewportAndZoom } from '../../directives';
import { MarkerKey } from '../../../configuration';
import { ObservableCache } from '../../helpers/observable-cache';
import { Inject, Injectable } from '@angular/core';
import { ListCnfsUseCase } from '../../../../use-cases';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { getMarkerToDisplay, MapChange, toFeatureCollection } from './permanence-map.utils';

export type CnfsPermanenceFeatureCollection = FeatureCollection<Point, CnfsPermanenceMarkerProperties>;

@Injectable()
export class CnfsPermanenceMapPresenter {
  private readonly _cnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
    this.listCnfsUseCase.execute$().pipe(map(cnfsCoreToCnfsPermanenceFeatures), share());

  private readonly _markersPermanencesCache: ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey>();

  public constructor(
    @Inject(ListCnfsUseCase) private readonly listCnfsUseCase: ListCnfsUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private cnfsPermanences$(): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return this._markersPermanencesCache.request$(this._cnfsPermanences$, MarkerKey.CnfsPermanence) as Observable<
      Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
    >;
  }

  private cnfsPermanencesInViewportOrEmpty$(
    markerTypeToDisplay: MarkerKey,
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsPermanence,
      this.listCnfsPermanencesInViewport$(viewportAndZoom),
      of([])
    );
  }

  private listCnfsPermanencesInViewport$(
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return this.cnfsPermanences$().pipe(
      map(
        (
          allCnfs: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
        ): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] =>
          this.mapViewCullingService.cull(allCnfs, viewportAndZoom)
      ),
      share()
    );
  }

  public markers$([viewportAndZoom, forceCnfsPermanence]: MapChange): Observable<CnfsPermanenceFeatureCollection> {
    return this.cnfsPermanencesInViewportOrEmpty$(
      getMarkerToDisplay(forceCnfsPermanence, viewportAndZoom),
      viewportAndZoom
    ).pipe(map(toFeatureCollection));
  }
}
