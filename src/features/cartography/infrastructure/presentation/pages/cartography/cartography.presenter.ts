import { Inject, Injectable } from '@angular/core';
import {
  listCnfsByRegionToPresentation,
  cnfsCoreToPresentation,
  CenterView,
  MarkerEvent,
  StructurePresentation,
  emptyFeatureCollection
} from '../../models';
import { Coordinates } from '../../../../core';
import { iif, map, Observable, of, switchMap } from 'rxjs';
import { ListCnfsByRegionUseCase, ListCnfsPositionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { FeatureCollection, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { CnfsByRegionProperties, CnfsPermanenceProperties } from '../../../../../../environments/environment.model';
import { combineLatestWith, mergeMap } from 'rxjs/operators';
import { ViewBox } from '../../directives/leaflet-map-state-change';
import { SPLIT_REGION_ZOOM } from './cartography.page';

const CITY_ZOOM_LEVEL: number = 12;

export const markerEventToCenterView = (markerEvent: MarkerEvent): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: markerEvent.markerProperties['boundingZoom'] as number
});

export const coordinatesToCenterView = (coordinates: Coordinates): CenterView => ({
  coordinates,
  zoomLevel: CITY_ZOOM_LEVEL
});

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

    // TODO Remplacer par SPLIT_DEPARTEMENT_ZOOM quand la feature aura été mergée
    return viewBox$.pipe(
      mergeMap(
        (viewBox: ViewBox): Observable<FeatureCollection<Point, CnfsPermanenceProperties>> =>
          iif((): boolean => viewBox.zoomLevel < SPLIT_REGION_ZOOM, emptyPositions$, onlyVisiblePositions$)
      )
    );
  }

  public structuresList$(): Observable<StructurePresentation[]> {
    return of([
      {
        address: '12 rue des Acacias, 69002 Lyon',
        name: 'Association des centres sociaux et culturels de Lyon',
        type: ''
      },
      {
        address: '31 Avenue de la mer, 13003 Marseille',
        name: 'Médiathèque de la mer',
        type: ''
      }
    ]);
  }
}
