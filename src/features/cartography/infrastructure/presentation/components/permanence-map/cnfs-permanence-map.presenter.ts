import { BehaviorSubject, iif, map, Observable, of } from 'rxjs';
import { Feature, FeatureCollection, Point } from 'geojson';
import {
  cnfsCoreToCnfsPermanenceFeatures,
  CnfsPermanenceMarkerProperties,
  CnfsPermanenceProperties,
  MarkerProperties,
  PointOfInterestMarkerProperties
} from '../../models';
import { combineLatestWith, mergeMap, share } from 'rxjs/operators';
import { ViewportAndZoom } from '../../directives';
import { MarkerKey } from '../../../configuration';
import { ObservableCache } from '../../helpers/observable-cache';
import { Inject, Injectable } from '@angular/core';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { ListCnfsUseCase } from '../../../../use-cases';
import { MapViewCullingService } from '../../services/map-view-culling.service';

// TODO Inject though configuration token
const DEFAULT_MAP_VIEWPORT_AND_ZOOM: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

// todo: duplicated code
const markerTypeToDisplayAtZoomLevel = (zoomLevel: number): MarkerKey => {
  if (zoomLevel > DEPARTMENT_ZOOM_LEVEL) return MarkerKey.CnfsPermanence;
  if (zoomLevel > REGION_ZOOM_LEVEL) return MarkerKey.CnfsByDepartment;
  return MarkerKey.CnfsByRegion;
};

// todo: duplicated code
const getMarkerToDisplay = (forceCnfsPermanenceDisplay: boolean, viewportWithZoomLevel: ViewportAndZoom): MarkerKey =>
  forceCnfsPermanenceDisplay ? MarkerKey.CnfsPermanence : markerTypeToDisplayAtZoomLevel(viewportWithZoomLevel.zoomLevel);

@Injectable()
export class CnfsPermanenceMapPresenter {
  private readonly _cnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
    this.listCnfsUseCase.execute$().pipe(map(cnfsCoreToCnfsPermanenceFeatures), share());

  private readonly _markersPermanencesCache: ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey>();

  // todo: duplicated code
  private readonly _viewportAndZoom$: BehaviorSubject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );

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

  private cnfsPermanencesWithHighlightThroughViewportAtZoomLevel$(
    markerTypeToDisplay: MarkerKey,
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> {
    return this.cnfsPermanencesInViewportOrEmpty$(markerTypeToDisplay, viewportAndZoom);
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

  // todo: duplicated code
  public setViewportAndZoom(viewportAndZoom: ViewportAndZoom): void {
    this._viewportAndZoom$.next(viewportAndZoom);
  }

  // eslint-disable-next-line max-lines-per-function
  public visibleMapCnfsPermanencesThroughViewportAtZoomLevel$(
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<FeatureCollection<Point, CnfsPermanenceMarkerProperties>> {
    return this._viewportAndZoom$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay]: [ViewportAndZoom, boolean]): Observable<
          Feature<Point, CnfsPermanenceMarkerProperties>[]
        > =>
          this.cnfsPermanencesWithHighlightThroughViewportAtZoomLevel$(
            getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel),
            viewportWithZoomLevel
          )
      ),
      map(
        (
          cnfsPermanencesFeatures: Feature<Point, CnfsPermanenceMarkerProperties>[]
        ): FeatureCollection<Point, CnfsPermanenceMarkerProperties> => ({
          features: cnfsPermanencesFeatures,
          type: 'FeatureCollection'
        })
      )
    );
  }
}
