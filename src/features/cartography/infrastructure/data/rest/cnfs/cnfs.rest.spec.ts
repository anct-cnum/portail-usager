import { CnfsRest } from './cnfs.rest';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom, Observable, of} from 'rxjs';
import {CnfsByRegion, Coordinates} from '../../../../core';
import {CnfsByRegionTransfer} from '../../models';

const CNFS_BY_REGION_TRANSFER: CnfsByRegionTransfer = {
  features: [
    {
      geometry: {
        coordinates: [
          6.053333,
          43.955
        ],
        type: 'Point'
      },
      properties: {
        count: 2,
        region: 'Provence-Alpes-Côte d\'Azur',
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [
          2.775278,
          49.966111
        ],
        type: 'Point'
      },
      properties: {
        count: 7,
        region: 'Hauts-de-France'
      },
      type: 'Feature'
    },
  ],
  type: 'FeatureCollection'
};

describe('cnfs rest repository', (): void => {
  const httpClient: HttpClient = {
    get(): Observable<CnfsByRegionTransfer> {
      return of(CNFS_BY_REGION_TRANSFER);
    }
  } as unknown as HttpClient;

  it('should list cnfs by region', async (): Promise<void> => {
    const expectedCnfsByRegion: CnfsByRegion[] = [
      new CnfsByRegion(
        new Coordinates(43.955, 6.053333), {
          count: 2,
          region: 'Provence-Alpes-Côte d\'Azur'
        }
      ),
      new CnfsByRegion(
        new Coordinates(49.966111, 2.775278), {
          count: 7,
          region: 'Hauts-de-France'
        }
      )
    ];
    const cnfsRestRepository: CnfsRest = new CnfsRest(httpClient);

    const response: CnfsByRegion[] = await firstValueFrom(cnfsRestRepository.listCnfsByRegion$());

    expect(response).toStrictEqual(expectedCnfsByRegion);
  });
});
