import { Observable, map, switchMap, of } from 'rxjs';
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
  private readonly _addressFallbackEndpoint: string = 'search';
  private readonly _addressSearchEndpoint: string = 'search';

  private readonly _geoCodePostalParameter: string = 'codePostal=';
  private readonly _geoCommunesEndpoint: string = 'communes';

  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  private combinedGeoAndAddressRequests$(postalCode: string, addressQuery: string): Observable<Coordinates> {
    const getAddressApiFullUrlWithLocality = (localityName: string): string =>
      this.getAddressApiFullUrl(
        replacePostalCodeByLocalityName(addressQuery, postalCode, localityName),
        `?postcode=${postalCode}&limit=1&q=`
      );

    return this.httpClient
      .get<ApiGeoResult[]>(this.getGeoApiFullUrl(postalCode))
      .pipe(switchMap(this.completedAddressRequest$(getAddressApiFullUrlWithLocality, addressQuery)));
  }

  private completedAddressRequest$(
    getAddressApiFullUrlWithLocality: (localityName: string) => string,
    originalAddressQueryForFallBack: string
  ): (geoResult: ApiGeoResult[]) => Observable<Coordinates> {
    return (geoResult: ApiGeoResult[]): Observable<Coordinates> => {
      const localityNameByPostalCode: string = firstResultLocalityNameOrEmpty(geoResult);

      return this.httpClient
        .get<FeatureCollection<Point>>(getAddressApiFullUrlWithLocality(localityNameByPostalCode))
        .pipe(switchMap(this.tryFallbackIfNoResult(originalAddressQueryForFallBack)), map(featureCollectionToFirstCoordinates));
    };
  }

  private getAddressApiFullUrl(userAddressQuery: string, queryParameters: string = '?q='): string {
    return `${Api.Adresse}/${this._addressSearchEndpoint}/${queryParameters}${encodeURI(userAddressQuery)}`;
  }

  private getAddressFallbackApiFullUrl(
    userAddressQuery: string,
    queryParameters: string = '?countrycodes=FR&format=geojson&limit=1&q='
  ): string {
    return `${Api.AdresseFallback}/${this._addressFallbackEndpoint}/${queryParameters}${encodeURI(userAddressQuery)}`;
  }

  private getGeoApiFullUrl(postalCode: string): string {
    return `${Api.Geo}/${this._geoCommunesEndpoint}?${this._geoCodePostalParameter}${postalCode}`;
  }

  private simpleAddressRequest$(usagerAddressInput: string): Observable<Coordinates> {
    return this.httpClient
      .get<FeatureCollection<Point>>(this.getAddressApiFullUrl(usagerAddressInput))
      .pipe(map(featureCollectionToFirstCoordinates));
  }

  private tryFallbackIfNoResult(
    originalAddressQueryForFallBack: string
  ): (apiAddressResponse: FeatureCollection<Point>) => Observable<FeatureCollection<Point>> {
    return (apiAddressResponse: FeatureCollection<Point>): Observable<FeatureCollection<Point>> =>
      apiAddressResponse.features.length === 0
        ? this.httpClient.get<FeatureCollection<Point>>(this.getAddressFallbackApiFullUrl(originalAddressQueryForFallBack))
        : of(apiAddressResponse);
  }

  public geocodeAddress$(usagerAddressInput: string): Observable<Coordinates> {
    const { capturedPostalCode, hasPostalCode }: PostalCodeRegexResult = capturePostalCode(usagerAddressInput);

    return hasPostalCode
      ? this.combinedGeoAndAddressRequests$(capturedPostalCode, usagerAddressInput)
      : this.simpleAddressRequest$(usagerAddressInput);
  }
}
