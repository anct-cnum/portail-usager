import { Inject, Injectable } from '@angular/core';
import {
  cnfsByDepartmentToPresentation,
  cnfsCoreToCnfsPermanenceFeatures,
  CnfsPermanenceProperties,
  listCnfsByRegionToPresentation,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  StructurePresentation
} from '../../models';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { EMPTY, iif, map, merge, Observable, of, switchMap } from 'rxjs';
import { ListCnfsByDepartmentUseCase, ListCnfsByRegionUseCase, ListCnfsUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { Feature, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { mergeMap, share } from 'rxjs/operators';
import { ViewportAndZoom } from '../../directives/leaflet-map-state-change';
import { cnfsPermanencesToStructurePresentations } from '../../models/structure/structure.presentation-mapper';
import { Marker } from '../../../configuration';
import { ObservableCache } from '../../helpers/observable-cache';

export const REGION_ZOOM_LEVEL: number = 6;
export const DEPARTMENT_ZOOM_LEVEL: number = 9;
export const CITY_ZOOM_LEVEL: number = 12;

export const markerTypeToDisplayAtZoomLevel = (zoomLevel: number): Marker => {
  if (zoomLevel > DEPARTMENT_ZOOM_LEVEL) return Marker.CnfsPermanence;
  if (zoomLevel > REGION_ZOOM_LEVEL) return Marker.CnfsByDepartment;
  return Marker.CnfsByRegion;
};

@Injectable()
export class CartographyPresenter {
  private readonly _cnfsByDepartment$: Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> =
    this.listCnfsByDepartmentUseCase.execute$().pipe(map(cnfsByDepartmentToPresentation), share());
  private readonly _cnfsByRegion$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
    this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation), share());
  private readonly _cnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
    this.listCnfsPositionUseCase.execute$().pipe(map(cnfsCoreToCnfsPermanenceFeatures), share());

  private readonly _markersCache: ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[]> = new ObservableCache<
    Feature<Point, PointOfInterestMarkerProperties>[]
  >();

  public constructor(
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase,
    @Inject(ListCnfsUseCase) private readonly listCnfsPositionUseCase: ListCnfsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private cnfsByDepartmentOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsByDepartment,
      this._markersCache.request$(this._cnfsByDepartment$, 'cnfsByDepartment'),
      EMPTY
    );
  }

  private cnfsByRegionOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsByRegion,
      this._markersCache.request$(this._cnfsByRegion$, 'cnfsByRegion'),
      EMPTY
    );
  }

  private cnfsMarkersInViewportAtZoomLevel$(
    viewportWithZoomLevel$: Observable<ViewportAndZoom>
  ): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return viewportWithZoomLevel$.pipe(
      mergeMap((viewportWithZoomLevel: ViewportAndZoom): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> => {
        const markerTypeToDisplay: Marker = markerTypeToDisplayAtZoomLevel(viewportWithZoomLevel.zoomLevel);
        return merge(
          this.cnfsByRegionOrEmpty$(markerTypeToDisplay),
          this.cnfsByDepartmentOrEmpty$(markerTypeToDisplay),
          this.cnfsPermanencesInViewportOrEmpty$(markerTypeToDisplay, viewportWithZoomLevel)
        );
      })
    );
  }

  private cnfsPermanences$(): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return this._markersCache.request$(this._cnfsPermanences$, 'cnfsPermanences') as Observable<
      Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
    >;
  }

  private cnfsPermanencesInViewportOrEmpty$(
    markerTypeToDisplay: Marker,
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsPermanence,
      this.listCnfsPermanencesInViewport$(viewportAndZoom),
      EMPTY
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

  public geocodeAddress$(addressToGeocode$: Observable<string>): Observable<Coordinates> {
    return addressToGeocode$.pipe(
      switchMap((address: string): Observable<Coordinates> => this.geocodeAddressUseCase.execute$(address))
    );
  }

  public structuresList$(viewportAndZoom$: Observable<ViewportAndZoom>): Observable<StructurePresentation[]> {
    return viewportAndZoom$.pipe(
      mergeMap(
        (viewportAndZoom: ViewportAndZoom): Observable<StructurePresentation[]> =>
          iif(
            (): boolean => markerTypeToDisplayAtZoomLevel(viewportAndZoom.zoomLevel) === Marker.CnfsPermanence,
            this.listCnfsPermanencesInViewport$(viewportAndZoom).pipe(map(cnfsPermanencesToStructurePresentations)),
            of([])
          )
      )
    );
  }

  public visibleMapPointsOfInterestThroughViewportAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>
  ): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return this.cnfsMarkersInViewportAtZoomLevel$(viewBoxWithZoomLevel$);
  }
}
