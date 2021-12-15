import { Inject, Injectable } from '@angular/core';
import {
  listCnfsByRegionToPresentation,
  cnfsCoreToPresentation,
  MarkersPresentation,
  MarkerProperties,
  CenterView,
  MarkerEvent
} from '../../models';
import { Coordinates } from '../../../../core';
import { map, Observable, switchMap } from 'rxjs';
import { ListCnfsByRegionUseCase, ListCnfsPositionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { FeatureCollection, Point } from 'geojson';
import { ClusterService } from '../../services/cluster.service';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';
import { combineLatestWith } from 'rxjs/operators';
import { ViewBox } from '../../directives/leaflet-map-state-change';

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
    @Inject(ClusterService) private readonly clusterService: ClusterService
  ) {}

  private onlyVisibleMarkers(): ([cnfsFeatureCollection, viewBox]: [
    FeatureCollection<Point, AnyGeoJsonProperty>,
    ViewBox
  ]) => MarkersPresentation {
    return ([cnfsFeatureCollection, viewBox]: [
      FeatureCollection<Point, AnyGeoJsonProperty>,
      ViewBox
    ]): MarkersPresentation => ({
      features: this.clusterService.onlyVisibleMarkers(cnfsFeatureCollection, viewBox),
      type: 'FeatureCollection'
    });
  }
  public geocodeAddress$(addressToGeocode$: Observable<string>): Observable<Coordinates> {
    return addressToGeocode$.pipe(
      switchMap((address: string): Observable<Coordinates> => this.geocodeAddressUseCase.execute$(address))
    );
  }

  public listCnfsByRegionPositions$(): Observable<MarkersPresentation> {
    return this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation));
  }

  public listCnfsPositions$(viewBox$: Observable<ViewBox>): Observable<MarkersPresentation> {
    return this.listCnfsPositionUseCase
      .execute$()
      .pipe(map(cnfsCoreToPresentation), combineLatestWith(viewBox$), map(this.onlyVisibleMarkers()));
  }
}
