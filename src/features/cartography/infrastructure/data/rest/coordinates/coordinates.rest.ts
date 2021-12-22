import { Observable, map, switchMap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordinates, CoordinatesRepository } from '../../../../core';
import { FeatureCollection, Point } from 'geojson';
import { featureCollectionToFirstCoordinates } from '../../models/coordinates.transfer-mapper';
import { Api } from '../../../../../../environments/environment.model';
import { capturePostalCode } from './coordinates-helpers';

interface ApiGeoResult {
  nom: string;
}

export interface PostalCodeRegexResult {
  capturedPostalCode: string;
  hasPostalCode: boolean;
}

const replacePostalCodeByLocalityName = (addressQuery: string, postalCode: string, localityName: string): string =>
  addressQuery.replace(postalCode, localityName);

const firstResultLocalityNameOrEmpty = (geoResult: ApiGeoResult[]): string => (geoResult.length > 0 ? geoResult[0].nom : '');

@Injectable()
export class CoordinatesRest extends CoordinatesRepository {
  private readonly _addressQueryParameters: string = '?q=';
  private readonly _addressSearchEndpoint: string = 'search';

  private readonly _geoCodePostalParameter: string = 'codePostal=';
  private readonly _geoCommunesEndpoint: string = 'communes';

  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  private combinedGeoAndAddressRequests$(postalCode: string, addressQuery: string): Observable<Coordinates> {
    const getAddressApiFullUrlWithLocality = (localityName: string): string =>
      this.getAddressApiFullUrl(replacePostalCodeByLocalityName(addressQuery, postalCode, localityName));

    return this.httpClient
      .get<ApiGeoResult[]>(this.getGeoApiFullUrl(postalCode))
      .pipe(switchMap(this.completedAddressRequest$(getAddressApiFullUrlWithLocality)));
  }

  private completedAddressRequest$(
    getAddressApiFullUrlWithLocality: (localityName: string) => string
  ): (geoResult: ApiGeoResult[]) => Observable<Coordinates> {
    return (geoResult: ApiGeoResult[]): Observable<Coordinates> => {
      const localityNameByPostalCode: string = firstResultLocalityNameOrEmpty(geoResult);

      return this.httpClient
        .get<FeatureCollection<Point>>(getAddressApiFullUrlWithLocality(localityNameByPostalCode))
        .pipe(map(featureCollectionToFirstCoordinates));
    };
  }

  private getAddressApiFullUrl(addressQuery: string): string {
    return `${Api.Adresse}/${this._addressSearchEndpoint}/${this._addressQueryParameters}${encodeURI(addressQuery)}`;
  }

  private getGeoApiFullUrl(postalCode: string): string {
    return`${Api.Geo}/${this._geoCommunesEndpoint}?${this._geoCodePostalParameter}${postalCode}`;
  }

  private simpleAddressRequest$(addressQuery: string): Observable<Coordinates> {
    return this.httpClient
      .get<FeatureCollection<Point>>(this.getAddressApiFullUrl(addressQuery))
      .pipe(map(featureCollectionToFirstCoordinates));
  }

  public geocodeAddress$(addressQuery: string): Observable<Coordinates> {
    const { capturedPostalCode, hasPostalCode }: PostalCodeRegexResult = capturePostalCode(addressQuery);

    return hasPostalCode
      ? this.combinedGeoAndAddressRequests$(capturedPostalCode, addressQuery)
      : this.simpleAddressRequest$(addressQuery);
  }
}
