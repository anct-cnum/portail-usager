import { Observable, map } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordinates, CoordinatesRepository } from '../../../../core';
import { FeatureCollection, Point } from 'geojson';
import { featureCollectionToFirstCoordinates } from '../../models/coordinates.transfer-mapper';
import { Api } from '../../../../../../environments/environment.model';

@Injectable()
export class CoordinatesRest extends CoordinatesRepository {
  private readonly _queryParameters: string = '?format=geojson&countrycodes=FR&q=';
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
