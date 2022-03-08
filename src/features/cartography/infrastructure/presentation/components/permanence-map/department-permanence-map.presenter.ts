import { BehaviorSubject, iif, map, Observable, of } from 'rxjs';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByDepartmentMarkerProperties, cnfsByDepartmentToPresentation, MarkerProperties } from '../../models';
import { combineLatestWith, mergeMap, share } from 'rxjs/operators';
import { ViewportAndZoom } from '../../directives';
import { MarkerKey } from '../../../configuration';
import { CnfsByDepartmentProperties } from '../../../../core';
import { ObservableCache } from '../../helpers/observable-cache';
import { Inject, Injectable } from '@angular/core';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { ListCnfsByDepartmentUseCase } from '../../../../use-cases';

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
export class DepartmentPermanenceMapPresenter {
  private readonly _cnfsByDepartment$: Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> =
    this.listCnfsByDepartmentUseCase.execute$().pipe(map(cnfsByDepartmentToPresentation), share());

  private readonly _markersDepartmentCache: ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey>();

  // todo: duplicated code
  private readonly _viewportAndZoom$: BehaviorSubject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );

  public constructor(
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase
  ) {}

  private cnfsByDepartmentAtZoomLevel$(
    viewportWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean>
  ): Observable<Feature<Point, CnfsByDepartmentMarkerProperties>[]> {
    return viewportWithZoomLevel$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay]: [ViewportAndZoom, boolean]): Observable<
          Feature<Point, CnfsByDepartmentMarkerProperties>[]
        > => this.cnfsByDepartmentOrEmpty$(getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel))
      )
    );
  }

  private cnfsByDepartmentOrEmpty$(
    markerTypeToDisplay: MarkerKey
  ): Observable<Feature<Point, CnfsByDepartmentMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsByDepartment,
      this._markersDepartmentCache.request$(this._cnfsByDepartment$, MarkerKey.CnfsByDepartment),
      of([])
    );
  }

  // todo: duplicated code
  public setViewportAndZoom(viewportAndZoom: ViewportAndZoom): void {
    this._viewportAndZoom$.next(viewportAndZoom);
  }

  public visibleMapCnfsByDepartmentAtZoomLevel$(
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<FeatureCollection<Point, CnfsByDepartmentMarkerProperties>> {
    return this.cnfsByDepartmentAtZoomLevel$(this._viewportAndZoom$, forceCnfsPermanenceDisplay$).pipe(
      map(
        (
          cnfsByDepartementFeatures: Feature<Point, CnfsByDepartmentMarkerProperties>[]
        ): FeatureCollection<Point, CnfsByDepartmentMarkerProperties> => ({
          features: cnfsByDepartementFeatures,
          type: 'FeatureCollection'
        })
      )
    );
  }
}
