import { CnfsRest } from './cnfs.rest';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CnfsByRegion, CnfsByDepartment, CnfsDetails, Coordinates, StructureContact } from '../../../../core';
import { CnfsByRegionTransfer, CnfsByDepartmentTransfer, CnfsDetailsTransfer } from '../../models';

const CNFS_BY_REGION_TRANSFER: CnfsByRegionTransfer = {
  features: [
    {
      geometry: {
        coordinates: [6.053333, 43.955],
        type: 'Point'
      },
      properties: {
        boundingZoom: 8,
        count: 2,
        region: "Provence-Alpes-Côte d'Azur"
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [2.775278, 49.966111],
        type: 'Point'
      },
      properties: {
        boundingZoom: 8,
        count: 7,
        region: 'Hauts-de-France'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

const CNFS_BY_DEPARTMENT_TRANSFER: CnfsByDepartmentTransfer = {
  features: [
    {
      geometry: {
        coordinates: [5.348666025399395, 46.099798450280282],
        type: 'Point'
      },
      properties: {
        boundingZoom: 10,
        codeDepartement: '01',
        count: 12,
        nomDepartement: 'Ain'
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [45.147364453253317, -12.820655090736881],
        type: 'Point'
      },
      properties: {
        boundingZoom: 10,
        codeDepartement: '976',
        count: 27,
        nomDepartement: 'Mayotte'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

describe('cnfs rest repository', (): void => {
  it('should list cnfs by region', async (): Promise<void> => {
    const httpClient: HttpClient = {
      get(): Observable<CnfsByRegionTransfer> {
        return of(CNFS_BY_REGION_TRANSFER);
      }
    } as unknown as HttpClient;

    const expectedCnfsByRegion: CnfsByRegion[] = [
      new CnfsByRegion(new Coordinates(43.955, 6.053333), {
        boundingZoom: 8,
        count: 2,
        region: "Provence-Alpes-Côte d'Azur"
      }),
      new CnfsByRegion(new Coordinates(49.966111, 2.775278), {
        boundingZoom: 8,
        count: 7,
        region: 'Hauts-de-France'
      })
    ];
    const cnfsRestRepository: CnfsRest = new CnfsRest(httpClient);

    const response: CnfsByRegion[] = await firstValueFrom(cnfsRestRepository.listCnfsByRegion$());

    expect(response).toStrictEqual(expectedCnfsByRegion);
  });

  it('should list cnfs by department', async (): Promise<void> => {
    const httpClient: HttpClient = {
      get(): Observable<CnfsByDepartmentTransfer> {
        return of(CNFS_BY_DEPARTMENT_TRANSFER);
      }
    } as unknown as HttpClient;

    const expectedCnfsByDepartment: CnfsByDepartment[] = [
      new CnfsByDepartment(new Coordinates(46.099798450280282, 5.348666025399395), {
        boundingZoom: 10,
        code: '01',
        count: 12,
        department: 'Ain'
      }),
      new CnfsByDepartment(new Coordinates(-12.820655090736881, 45.147364453253317), {
        boundingZoom: 10,
        code: '976',
        count: 27,
        department: 'Mayotte'
      })
    ];
    const cnfsRestRepository: CnfsRest = new CnfsRest(httpClient);

    const response: CnfsByDepartment[] = await firstValueFrom(cnfsRestRepository.listCnfsByDepartment$());

    expect(response).toStrictEqual(expectedCnfsByDepartment);
  });

  it('should get cnfs details', async (): Promise<void> => {
    const cnfsDetailsTransfer: CnfsDetailsTransfer = {
      adresse: '12 RUE DE LA PLACE, 87100 LIMOGES',
      email: 'john.doe@aide-rurale.net',
      nom: 'Aide rurale',
      nombreCnfs: 2,
      telephone: '04 23 45 68 97'
    };

    const httpClient: HttpClient = {
      get(): Observable<CnfsDetailsTransfer> {
        return of(cnfsDetailsTransfer);
      }
    } as unknown as HttpClient;

    const expectedCnfsDetails: CnfsDetails = new CnfsDetails(
      2,
      'Aide rurale',
      [],
      '12 RUE DE LA PLACE, 87100 LIMOGES',
      new StructureContact('john.doe@aide-rurale.net', '04 23 45 68 97')
    );

    const cnfsRestRepository: CnfsRest = new CnfsRest(httpClient);

    const cnfsDetails: CnfsDetails = await firstValueFrom(cnfsRestRepository.cnfsDetails$());

    expect(cnfsDetails).toStrictEqual(expectedCnfsDetails);
  });
});
