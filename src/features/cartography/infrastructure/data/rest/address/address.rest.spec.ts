import { AddressRest } from './address.rest';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AddressFound, Coordinates } from '../../../../core';
import { AddressFoundTransfer, CoordinatesTransfer } from '../../models';

describe('address rest', (): void => {
  it('should get location coordinates from string address', async (): Promise<void> => {
    const geocodeTransfer: CoordinatesTransfer = [
      {
        geometry: {
          coordinates: [-1.012996, 46.869512],
          type: 'Point'
        },
        properties: {
          address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS'
        },
        type: 'Feature'
      }
    ];
    const address: string = '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS';
    const expectedCoordinates: Coordinates = new Coordinates(46.869512, -1.012996);
    const httpClient: HttpClient = {
      get: (): Observable<CoordinatesTransfer> => of(geocodeTransfer)
    } as unknown as HttpClient;
    const addressRest: AddressRest = new AddressRest(httpClient);

    const coordinates: Coordinates | null = await firstValueFrom(addressRest.geocode$(address));

    expect(coordinates).toStrictEqual(expectedCoordinates);
  });

  it('should get null when no location coordinates have been found from string address', async (): Promise<void> => {
    const geocodeTransfer: CoordinatesTransfer = [];
    const address: string = 'AddressError';

    const httpClient: HttpClient = {
      get: (): Observable<CoordinatesTransfer> => of(geocodeTransfer)
    } as unknown as HttpClient;
    const addressRest: AddressRest = new AddressRest(httpClient);

    const coordinates: Coordinates | null = await firstValueFrom(addressRest.geocode$(address));

    expect(coordinates).toBeNull();
  });

  it('should get a list of addresses from string address', async (): Promise<void> => {
    const searchTerm: string = 'Paris';
    const expectedAddresses: AddressFound[] = [
      {
        context: '75, Paris, Île-de-France',
        label: 'Paris'
      }
    ];

    const httpClient: HttpClient = {
      get: (): Observable<AddressFoundTransfer> =>
        of({
          attribution: 'BAN',
          features: [
            {
              geometry: {
                coordinates: [2.347, 48.859],
                type: 'Point'
              },
              properties: {
                city: 'Paris',
                citycode: '75056',
                context: '75, Paris, Île-de-France',
                id: '75056',
                importance: 0.67505,
                label: 'Paris',
                name: 'Paris',
                population: 2190327,
                postcode: '75001',
                score: 0.9704590909090908,
                type: 'municipality',
                x: 652089.7,
                y: 6862305.26
              },
              type: 'Feature'
            }
          ],
          licence: 'ETALAB-2.0',
          limit: 1,
          query: 'paris',
          type: 'FeatureCollection',
          version: 'draft'
        })
    } as unknown as HttpClient;

    const addressRest: AddressRest = new AddressRest(httpClient);

    const addresses: AddressFound[] = await firstValueFrom(addressRest.search$(searchTerm));

    expect(addresses).toStrictEqual(expectedAddresses);
  });
});
