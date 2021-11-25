import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';

import type { Coordinates } from '../../../../core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CoordinatesRepository } from '../../../../core';

import type { FeatureCollection, Point } from 'geojson';
import { featureCollectionToFirstCoordinates } from '../../models/coordinates.transfer-mapper';
import { Api } from '../../../../../../environments/environment.model';

@Injectable()
export class CoordinatesRest extends CoordinatesRepository {
  private readonly _queryParameters: string = '?q=';
  private readonly _searchEndpoint: string = 'search';

  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public geocodeAddress$(addressQuery: string): Observable<Coordinates> {
    return this.httpClient
      .get<FeatureCollection<Point>>(
        `${Api.Adresse}/${this._searchEndpoint}/${this._queryParameters}${encodeURI(addressQuery)}`
      )
      .pipe(map(featureCollectionToFirstCoordinates));
  }
}
