import { Inject, Injectable } from '@angular/core';
import {
  CenterView,
  cnfsCoreToPresentation,
  CnfsPermanenceProperties,
  emptyFeatureCollection,
  listCnfsByRegionToPresentation,
  MarkerEvent,
  StructurePresentation
} from '../../models';
import { CnfsByRegionProperties, Coordinates, StructureProperties } from '../../../../core';
import { iif, map, Observable, of, switchMap } from 'rxjs';
import { ListCnfsByRegionUseCase, ListCnfsPositionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { FeatureCollection, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { combineLatestWith, filter, mergeMap } from 'rxjs/operators';
import { ViewBox } from '../../directives/leaflet-map-state-change';
import { SPLIT_REGION_ZOOM } from './cartography.page';
import { mapPositionsToStructurePresentationArray } from '../../models/structure/structure.presentation-mapper';

const CITY_ZOOM_LEVEL: number = 12;

export const regionMarkerEventToCenterView = (markerEvent: MarkerEvent<CnfsByRegionProperties>): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: markerEvent.markerProperties.boundingZoom
});

export const permanenceMarkerEventToCenterView = (markerEvent: MarkerEvent<CnfsPermanenceProperties>): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: CITY_ZOOM_LEVEL
});

export const coordinatesToCenterView = (coordinates: Coordinates): CenterView => ({
  coordinates,
  zoomLevel: CITY_ZOOM_LEVEL
});

export const isCnfsPermanence = ({ structure }: { region?: string; structure?: StructureProperties }): boolean =>
  structure != null;

const isCnfsPermanenceFeatureCollection = (
  featureCollection: FeatureCollection<Point, CnfsByRegionProperties | CnfsPermanenceProperties>
): boolean => isCnfsPermanence(featureCollection.features[0]?.properties ?? {});

@Injectable()
export class CartographyPresenter {
  public constructor(
    @Inject(ListCnfsPositionUseCase) private readonly listCnfsPositionUseCase: ListCnfsPositionUseCase,
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private onlyVisiblePositions(): ([cnfsFeatureCollection, viewBox]: [
    FeatureCollection<Point, CnfsPermanenceProperties>,
    ViewBox
  ]) => FeatureCollection<Point, CnfsPermanenceProperties> {
    return ([cnfsFeatureCollection, viewBox]: [FeatureCollection<Point, CnfsPermanenceProperties>, ViewBox]): FeatureCollection<
      Point,
      CnfsPermanenceProperties
    > => this.mapViewCullingService.cull(cnfsFeatureCollection, viewBox);
  }

  public geocodeAddress$(addressToGeocode$: Observable<string>): Observable<Coordinates> {
    return addressToGeocode$.pipe(
      switchMap((address: string): Observable<Coordinates> => this.geocodeAddressUseCase.execute$(address))
    );
  }

  public listCnfsByRegionPositions$(): Observable<FeatureCollection<Point, CnfsByRegionProperties>> {
    return this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation));
  }

  public listCnfsPositions$(viewBox$: Observable<ViewBox>): Observable<FeatureCollection<Point, CnfsPermanenceProperties>> {
    const onlyVisiblePositions$: Observable<FeatureCollection<Point, CnfsPermanenceProperties>> = this.listCnfsPositionUseCase
      .execute$()
      .pipe(map(cnfsCoreToPresentation), combineLatestWith(viewBox$), map(this.onlyVisiblePositions()));

    const emptyPositions$: Observable<FeatureCollection<Point, CnfsPermanenceProperties>> = of(
      emptyFeatureCollection<CnfsPermanenceProperties>()
    );

    return viewBox$.pipe(
      mergeMap(
        (viewBox: ViewBox): Observable<FeatureCollection<Point, CnfsPermanenceProperties>> =>
          iif((): boolean => viewBox.zoomLevel < SPLIT_REGION_ZOOM, emptyPositions$, onlyVisiblePositions$)
      )
    );
  }

  public structuresList$(
    viewBox$: Observable<ViewBox>,
    visibleMapPositions$: Observable<FeatureCollection<Point, CnfsByRegionProperties | CnfsPermanenceProperties>>
  ): Observable<StructurePresentation[]> {
    const structureList$: Observable<StructurePresentation[]> = visibleMapPositions$.pipe(
      filter(isCnfsPermanenceFeatureCollection),
      map(mapPositionsToStructurePresentationArray)
    );

    const emptyStructureList$: Observable<StructurePresentation[]> = of([]);

    return viewBox$.pipe(
      mergeMap(
        (viewBox: ViewBox): Observable<StructurePresentation[]> =>
          iif((): boolean => viewBox.zoomLevel < SPLIT_REGION_ZOOM, emptyStructureList$, structureList$)
      )
    );
  }
}
