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
import { EMPTY, iif, map, merge, Observable, of, switchMap } from 'rxjs';
import { ListCnfsByDepartmentUseCase, ListCnfsByRegionUseCase, ListCnfsUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { Feature, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { mergeMap, share } from 'rxjs/operators';
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
  private readonly _listCnfsByDepartmentPositions$: Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> =
    this.listCnfsByDepartmentUseCase.execute$().pipe(map(cnfsByDepartmentToPresentation), share());
  private readonly _listCnfsByRegionPositions$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
    this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation), share());
  private readonly _listCnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
    this.listCnfsPositionUseCase.execute$().pipe(map(cnfsCoreToCnfsPermanenceFeatures), share());

  public constructor(
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase,
    @Inject(ListCnfsUseCase) private readonly listCnfsPositionUseCase: ListCnfsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private cnfsByDepartmentOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return iif((): boolean => markerTypeToDisplay === Marker.CnfsByDepartment, this._listCnfsByDepartmentPositions$, EMPTY);
  }

  private cnfsByRegionOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return iif((): boolean => markerTypeToDisplay === Marker.CnfsByRegion, this._listCnfsByRegionPositions$, EMPTY);
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
    return this._listCnfsPermanences$.pipe(
      map(
        (
          allCnfs: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
        ): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] =>
          this.mapViewCullingService.cull(allCnfs, viewportAndZoom)
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

  public visibleMapPointsOfInterestThroughViewportAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>
  ): Observable<Feature<Point, PointOfInterestMarkers>[]> {
    return this.cnfsMarkersInViewportAtZoomLevel$(viewBoxWithZoomLevel$);
  }
}
