import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CoordinatesRepository } from '../../../../core';

import type { Coordinates } from '../../../../core';

import type { FeatureCollection, Point } from 'geojson';
import { featureCollectionToFirstCoordinates } from '../../models/coordinates.transfer-mapper';

@Injectable()
export class CoordinatesRest extends CoordinatesRepository {
  // TODO Ajouter un intercepteur qui détecte toutes les routes qui commencent par @ et les remplacent le @ par https://API_DOMAINE, cette url étant stockée dans une configuration (token).
  private readonly _endpointUri: string = 'https://api-adresse.data.gouv.fr/search/?q=';

  public constructor(private readonly httpClient: HttpClient) {
    super();
  }

  public geocodeAddress$(address: string): Observable<Coordinates> {
    const endpoint: string = `${this._endpointUri}${encodeURI(address)}`;
    return this.httpClient.get<FeatureCollection<Point>>(endpoint).pipe(map(featureCollectionToFirstCoordinates));
  }
}
