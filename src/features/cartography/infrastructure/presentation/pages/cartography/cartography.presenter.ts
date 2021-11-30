import { Inject, Injectable } from '@angular/core';

import type { MapOptionsPresentation } from '../../models';
import { Coordinates } from '../../../../core';

import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { cnfsCoreToPresentation } from '../../models';

import { ListCnfsPositionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import type { FeatureCollection, Point } from 'geojson';
import { ClusterService } from '../../services/cluster.service';

// TODO Exporter dans une configuration, prendre la dernière position connue de l'usager ou le geocoding de l'adresse
const START_LATITUDE: number = 45.764043;
const START_LONGITUDE: number = 4.835659;
const DEFAULT_ZOOM_LEVEL: number = 6;

@Injectable()
export class CartographyPresenter {
  public constructor(
    @Inject(ListCnfsPositionUseCase) private readonly listCnfsPositionUseCase: ListCnfsPositionUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(ClusterService) public readonly clusterService: ClusterService
  ) {}

  // TODO Exporter dans une configuration
  public defaultMapOptions(): MapOptionsPresentation {
    return {
      centerCoordinates: new Coordinates(START_LATITUDE, START_LONGITUDE),
      zoomLevel: DEFAULT_ZOOM_LEVEL
    };
  }

  public geocodeAddress$(address: string): Observable<Coordinates> {
    return this.geocodeAddressUseCase.execute$(address);
  }

  public listCnfsPositions$(): Observable<FeatureCollection<Point>> {
    return this.listCnfsPositionUseCase.execute$().pipe(map(cnfsCoreToPresentation));
  }
}
