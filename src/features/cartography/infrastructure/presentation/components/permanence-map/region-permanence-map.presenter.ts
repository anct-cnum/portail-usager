import { BehaviorSubject, iif, map, Observable, of } from 'rxjs';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegionMarkerProperties, listCnfsByRegionToPresentation, MarkerProperties } from '../../models';
import { combineLatestWith, mergeMap, share } from 'rxjs/operators';
import { ViewportAndZoom } from '../../directives';
import { MarkerKey } from '../../../configuration';
import { CnfsByRegionProperties } from '../../../../core';
import { ObservableCache } from '../../helpers/observable-cache';
import { Inject, Injectable } from '@angular/core';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { ListCnfsByRegionUseCase } from '../../../../use-cases';

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
export class RegionPermanenceMapPresenter {
  private readonly _cnfsByRegion$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
    this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation), share());

  private readonly _markersRegionCache: ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey>();

  // todo: duplicated code
  private readonly _viewportAndZoom$: BehaviorSubject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );

  public constructor(@Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase) {}

  private cnfsByRegionAtZoomLevel$(
    viewportWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean>
  ): Observable<Feature<Point, CnfsByRegionMarkerProperties>[]> {
    return viewportWithZoomLevel$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay]: [ViewportAndZoom, boolean]): Observable<
          Feature<Point, CnfsByRegionMarkerProperties>[]
        > => this.cnfsByRegionOrEmpty$(getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel))
      )
    );
  }

  private cnfsByRegionOrEmpty$(markerTypeToDisplay: MarkerKey): Observable<Feature<Point, CnfsByRegionMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsByRegion,
      this._markersRegionCache.request$(this._cnfsByRegion$, MarkerKey.CnfsByRegion),
      of([])
    );
  }

  // todo: duplicated code
  public setViewportAndZoom(viewportAndZoom: ViewportAndZoom): void {
    this._viewportAndZoom$.next(viewportAndZoom);
  }

  public visibleMapCnfsByRegionAtZoomLevel$(
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<FeatureCollection<Point, CnfsByRegionMarkerProperties>> {
    return this.cnfsByRegionAtZoomLevel$(this._viewportAndZoom$, forceCnfsPermanenceDisplay$).pipe(
      map(
        (
          cnfsByRegionFeatures: Feature<Point, CnfsByRegionMarkerProperties>[]
        ): FeatureCollection<Point, CnfsByRegionMarkerProperties> => ({
          features: cnfsByRegionFeatures,
          type: 'FeatureCollection'
        })
      )
    );
  }
}
