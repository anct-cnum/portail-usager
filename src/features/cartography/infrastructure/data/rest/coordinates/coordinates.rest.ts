import { Observable, map } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordinates, CoordinatesRepository } from '../../../../core';
import { FeatureCollection, Point } from 'geojson';
import { featureCollectionToFirstCoordinates } from '../../models/coordinates.transfer-mapper';
import { Api } from '../../../../../../environments/environment.model';

export interface PostalCodeRegexResult {
  capturedPostalCode: string;
  hasPostalCode: boolean;
}

@Injectable()
export class CoordinatesRest extends CoordinatesRepository {
  private readonly _addressSearchEndpoint: string = 'geocode/v1/geojson';

  // Pour avoir tous les territoires français il faut mettre plusieurs codes de pays :  https://github.com/OpenCageData/opencagedata-misc-docs/blob/master/countrycode.md
  private readonly _queryParameters: string =
    '?key=b856c514cd67437fa2f8d6bc596ac65f&countrycode=fr,bl,gf,gp,mf,mq,nc,pf,pm,re,tf,wf,yt&limit=1&q=';

  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public geocodeAddress$(usagerAddressInput: string): Observable<Coordinates> {
    return this.httpClient
      .get<FeatureCollection<Point>>(
        `${Api.Adresse}/${this._addressSearchEndpoint}/${this._queryParameters}${encodeURI(usagerAddressInput)}`
      )
      .pipe(map(featureCollectionToFirstCoordinates));
  }
}
