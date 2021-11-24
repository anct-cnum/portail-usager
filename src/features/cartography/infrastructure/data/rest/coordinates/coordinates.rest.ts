import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CoordinatesRepository } from '../../../../core';

import type { Coordinates } from '../../../../core';

import type { FeatureCollection, Point } from 'geojson';
import { featureCollectionToCoordinates } from '../../models/coordinates.transfer-mapper';

@Injectable()
export class CoordinatesRest extends CoordinatesRepository {
  private readonly _endpointUri: string = 'https://api-adresse.data.gouv.fr/search/?q=';

  public constructor(private readonly httpClient: HttpClient) {
    super();
  }

  public geocodeAddress$(address: string): Observable<Coordinates> {
    const endpoint: string = `${this._endpointUri}${encodeURI(address)}`;
    return this.httpClient.get<FeatureCollection<Point>>(endpoint).pipe(map(featureCollectionToCoordinates));
  }
}
