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
import { Cnfs, CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { iif, map, Observable, of, switchMap, zip } from 'rxjs';
import { ListCnfsByDepartmentUseCase, ListCnfsByRegionUseCase, ListCnfsUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { Feature, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { mergeMap } from 'rxjs/operators';
import { ViewportAndZoom } from '../../directives/leaflet-map-state-change';
import { cnfsPermanencesToStructurePresentations } from '../../models/structure/structure.presentation-mapper';
import { Marker } from '../../../configuration';

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

const isArrayOfCnfsPermanence = (features: Feature<Point, PointOfInterestMarkers>[]): boolean =>
  features[0]?.properties.markerType === Marker.CnfsPermanence;

export const markerTypeToDisplayAtZoomLevel = (zoomLevel: number): Marker => {
  if (zoomLevel > DEPARTMENT_ZOOM_LEVEL) return Marker.CnfsPermanence;
  if (zoomLevel > REGION_ZOOM_LEVEL) return Marker.CnfsByDepartment;
  return Marker.CnfsByRegion;
};

const structuresOrEmpty =
  (
    visibleMarkers$: Observable<Feature<Point, PointOfInterestMarkers>[]>
  ): ((markers: Feature<Point, PointOfInterestMarkers>[]) => Observable<StructurePresentation[]>) =>
  (markers: Feature<Point, PointOfInterestMarkers>[]): Observable<StructurePresentation[]> =>
    iif(
      (): boolean => isArrayOfCnfsPermanence(markers),
      visibleMarkers$.pipe(
        map((cnfsPermanence: Feature<Point, PointOfInterestMarkers>[]): StructurePresentation[] =>
          cnfsPermanencesToStructurePresentations(
            cnfsPermanence as Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
          )
        )
      ),
      of([])
    );

@Injectable()
export class CartographyPresenter {
  public constructor(
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase,
    @Inject(ListCnfsUseCase) private readonly listCnfsPositionUseCase: ListCnfsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private listCnfsByDepartmentPositions$(): Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> {
    return this.listCnfsByDepartmentUseCase.execute$().pipe(map(cnfsByDepartmentToPresentation));
  }

  private listCnfsByRegionPositions$(): Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> {
    return this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation));
  }

  private listCnfsPermanences$(
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return this.listCnfsPositionUseCase
      .execute$()
      .pipe(
        map((allCnfs: Cnfs[]): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] =>
          this.mapViewCullingService.cull(cnfsCoreToCnfsPermanenceFeatures(allCnfs), viewportAndZoom)
        )
      );
  }

  public geocodeAddress$(addressToGeocode$: Observable<string>): Observable<Coordinates> {
    return addressToGeocode$.pipe(
      switchMap((address: string): Observable<Coordinates> => this.geocodeAddressUseCase.execute$(address))
    );
  }

  public structuresList$(
    visibleCnfsPermanenceMarkers$: Observable<Feature<Point, PointOfInterestMarkers>[]>
  ): Observable<StructurePresentation[]> {
    return visibleCnfsPermanenceMarkers$.pipe(mergeMap(structuresOrEmpty(visibleCnfsPermanenceMarkers$)));
  }

  // TODO Optimize to call the use-cases only once
  // eslint-disable-next-line max-lines-per-function
  public visibleMapPointsOfInterestThroughViewportAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>
  ): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return viewBoxWithZoomLevel$.pipe(
      mergeMap(
        // eslint-disable-next-line max-lines-per-function
        (viewBoxWithZoomLevel: ViewportAndZoom): Observable<Feature<Point, PointOfInterestMarkers>[]> =>
          this.zipResults$(viewBoxWithZoomLevel)
      )
    );
  }

  // TODO OPTIMIZE !!!
  // eslint-disable-next-line @typescript-eslint/member-ordering,max-lines-per-function
  private zipResults$(viewBoxWithZoomLevel: ViewportAndZoom): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return zip(
      iif(
        (): boolean => markerTypeToDisplayAtZoomLevel(viewBoxWithZoomLevel.zoomLevel) === Marker.CnfsByRegion,
        this.listCnfsByRegionPositions$(),
        of([])
      ),
      iif(
        (): boolean => markerTypeToDisplayAtZoomLevel(viewBoxWithZoomLevel.zoomLevel) === Marker.CnfsByDepartment,
        this.listCnfsByDepartmentPositions$(),
        of([])
      ),
      iif(
        (): boolean => markerTypeToDisplayAtZoomLevel(viewBoxWithZoomLevel.zoomLevel) === Marker.CnfsPermanence,
        this.listCnfsPermanences$(viewBoxWithZoomLevel),
        of([])
      )
    ).pipe(
      map(
        ([byRegion, byDepartement, permanence]: [
          Feature<Point, PointOfInterestMarkers>[],
          Feature<Point, PointOfInterestMarkers>[],
          Feature<Point, PointOfInterestMarkers>[]
        ]): Feature<Point, PointOfInterestMarkers>[] => {
          const res: Feature<Point, PointOfInterestMarkers>[] = [];
          res.push(...byRegion, ...byDepartement, ...permanence);
          return res;
        }
      )
    );
  }
}
