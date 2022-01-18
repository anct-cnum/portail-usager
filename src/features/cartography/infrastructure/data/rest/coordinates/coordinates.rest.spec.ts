import { CoordinatesRest } from './coordinates.rest';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Coordinates } from '../../../../core';
import { CoordinatesTransfer } from '../../models';

describe('coordinates rest', (): void => {
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
    const coordinatesRest: CoordinatesRest = new CoordinatesRest(httpClient);

    const coordinates: Coordinates = await firstValueFrom(coordinatesRest.geocodeAddress$(address));

    expect(coordinates).toStrictEqual(expectedCoordinates);
  });
});
