import { Inject, Injectable } from '@angular/core';

import type { CnfsPresentation, MapOptionsPresentation } from '../../models';
import { Coordinates } from '../../../../core';

import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { cnfsCoreToPresentation } from '../../models';
import { ListCnfsPositionUseCase } from '../../../../use-cases';

// TODO Exporter dans une configuration, prendre la dernière position connue de l'usager ou le geocoding de l'adresse
const START_LATITUDE: number = 45.764043;
const START_LONGITUDE: number = 4.835659;
const DEFAULT_ZOOM_LEVEL: number = 6;

@Injectable()
export class CartographyPresenter {
  public constructor(
    @Inject(ListCnfsPositionUseCase)
    private readonly listCnfsPositionUseCase: ListCnfsPositionUseCase
  ) {}

  // TODO Exporter dans une configuration
  public defaultMapOptions(): MapOptionsPresentation {
    return {
      centerCoordinates: new Coordinates(START_LATITUDE, START_LONGITUDE),
      zoomLevel: DEFAULT_ZOOM_LEVEL
    };
  }

  public listCnfsPositions$(): Observable<CnfsPresentation> {
    return this.listCnfsPositionUseCase.execute$().pipe(map(cnfsCoreToPresentation));
  }
}
