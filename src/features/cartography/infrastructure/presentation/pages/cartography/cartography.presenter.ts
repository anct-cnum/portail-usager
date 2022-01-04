// TODO Remove !!!
/* eslint-disable max-lines */
import { Inject, Injectable } from '@angular/core';
import {
  CenterView,
  cnfsByDepartmentToPresentation,
  cnfsCoreToCnfsPermanenceFeatures,
  CnfsPermanenceProperties,
  listCnfsByRegionToPresentation,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkers,
  StructurePresentation
} from '../../models';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { AsyncSubject, EMPTY, iif, map, merge, Observable, of, switchMap } from 'rxjs';
import { ListCnfsByDepartmentUseCase, ListCnfsByRegionUseCase, ListCnfsUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { Feature, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { mergeMap, share, tap } from 'rxjs/operators';
import { ViewportAndZoom } from '../../directives/leaflet-map-state-change';
import { Marker } from '../../../configuration';
import { cnfsPermanencesToStructurePresentations } from "../../models/structure/structure.presentation-mapper";

export const REGION_ZOOM_LEVEL: number = 7;
export const DEPARTMENT_ZOOM_LEVEL: number = 9;
export const CITY_ZOOM_LEVEL: number = 12;

export const regionMarkerEventToCenterView = (
  markerEvent: MarkerEvent<MarkerProperties<CnfsByRegionProperties>>
): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: markerEvent.markerProperties.boundingZoom
});

export const departmentMarkerEventToCenterView = (
  markerEvent: MarkerEvent<MarkerProperties<CnfsByDepartmentProperties>>
): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: markerEvent.markerProperties.boundingZoom
});

export const permanenceMarkerEventToCenterView = (
  markerEvent: MarkerEvent<MarkerProperties<CnfsPermanenceProperties>>
): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: CITY_ZOOM_LEVEL
});

export const coordinatesToCenterView = (coordinates: Coordinates): CenterView => ({
  coordinates,
  zoomLevel: CITY_ZOOM_LEVEL
});

export const markerTypeToDisplayAtZoomLevel = (zoomLevel: number): Marker => {
  if (zoomLevel > DEPARTMENT_ZOOM_LEVEL) return Marker.CnfsPermanence;
  if (zoomLevel > REGION_ZOOM_LEVEL) return Marker.CnfsByDepartment;
  return Marker.CnfsByRegion;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const cache: Record<string, AsyncSubject<Feature<Point, PointOfInterestMarkers>[]>> = {};

const requestOrCache$ = <T extends PointOfInterestMarkers>(
  cacheKey: string,
  observable$: Observable<Feature<Point, PointOfInterestMarkers>[]>
): Observable<Feature<Point, T>[]> => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (cache[cacheKey] != null) {
    // Console.log('returned cache', cache[cacheKey]);
    return cache[cacheKey].asObservable() as Observable<Feature<Point, T>[]>;
  }

  return observable$ as Observable<Feature<Point, T>[]>;
};

@Injectable()
export class CartographyPresenter {
  private readonly _listCnfsByDepartment$: Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> =
    this.listCnfsByDepartmentUseCase.execute$().pipe(
      map(cnfsByDepartmentToPresentation),
      tap((listCnfsByDepartmentPositions: Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]): void => {
        cache['listCnfsByDepartment'] = new AsyncSubject<Feature<Point, MarkerProperties<PointOfInterestMarkers>>[]>();
        cache['listCnfsByDepartment'].next(listCnfsByDepartmentPositions);
        cache['listCnfsByDepartment'].complete();
      }),
      share()
    );

  private readonly _listCnfsByRegionPositions$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
    this.listCnfsByRegionUseCase.execute$().pipe(
      map(listCnfsByRegionToPresentation),
      tap((listCnfsByRegion: Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]): void => {
        cache['listCnfsByRegion'] = new AsyncSubject<Feature<Point, MarkerProperties<PointOfInterestMarkers>>[]>();
        cache['listCnfsByRegion'].next(listCnfsByRegion);
        cache['listCnfsByRegion'].complete();
      }),
      share()
    );
  private readonly _listCnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
    this.listCnfsPositionUseCase.execute$().pipe(
      map(cnfsCoreToCnfsPermanenceFeatures),
      tap((listCnfsPermanences: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]): void => {
        cache['listCnfsPermanences'] = new AsyncSubject<Feature<Point, MarkerProperties<PointOfInterestMarkers>>[]>();
        cache['listCnfsPermanences'].next(listCnfsPermanences);
        cache['listCnfsPermanences'].complete();
      }),
      share()
    );

  public constructor(
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase,
    @Inject(ListCnfsUseCase) private readonly listCnfsPositionUseCase: ListCnfsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private cnfsByDepartmentOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsByDepartment,
      requestOrCache$('listCnfsByDepartment', this._listCnfsByDepartment$),
      EMPTY
    );
  }

  private cnfsByRegionOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsByRegion,
      requestOrCache$('listCnfsByRegion', this._listCnfsByRegionPositions$),
      EMPTY
    );
  }

  private cnfsMarkersInViewportAtZoomLevel$(
    viewportWithZoomLevel$: Observable<ViewportAndZoom>
  ): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return viewportWithZoomLevel$.pipe(
      mergeMap((viewportWithZoomLevel: ViewportAndZoom): Observable<Feature<Point, PointOfInterestMarkers>[]> => {
        const markerTypeToDisplay: Marker = markerTypeToDisplayAtZoomLevel(viewportWithZoomLevel.zoomLevel);
        return merge(
          this.cnfsByRegionOrEmpty$(markerTypeToDisplay),
          this.cnfsByDepartmentOrEmpty$(markerTypeToDisplay),
          this.cnfsPermanencesInViewportOrEmpty$(markerTypeToDisplay, viewportWithZoomLevel)
        );
      })
    );
  }

  private cnfsPermanencesInViewportOrEmpty$(
    markerTypeToDisplay: Marker,
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsPermanence,
      this.listCnfsPermanencesInViewport$(viewportAndZoom),
      EMPTY
    );
  }

  private listCnfsPermanencesInViewport$(
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return requestOrCache$<MarkerProperties<CnfsPermanenceProperties>>('listCnfsPermanences', this._listCnfsPermanences$).pipe(
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

  public structuresList$(
    viewportAndZoom$: Observable<ViewportAndZoom>
  ): Observable<StructurePresentation[]> {
    return viewportAndZoom$.pipe(
      mergeMap((viewportAndZoom: ViewportAndZoom): Observable<StructurePresentation[]> =>
        iif(
        (): boolean => markerTypeToDisplayAtZoomLevel(viewportAndZoom.zoomLevel) === Marker.CnfsPermanence,
        this.listCnfsPermanencesInViewport$(viewportAndZoom).pipe(map(cnfsPermanencesToStructurePresentations)),
        of([])
      ))
    );
}

  public visibleMapPointsOfInterestThroughViewportAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>
  ): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return this.cnfsMarkersInViewportAtZoomLevel$(viewBoxWithZoomLevel$);
  }
}
