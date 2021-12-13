import { CartographyPresenter } from './cartography.presenter';
import { ListCnfsPositionUseCase, ListCnfsByRegionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { ClusterService } from '../../services/cluster.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { FeatureCollection, Point } from 'geojson';
import { CnfsByRegion, CnfsByRegionProperties, Coordinates } from '../../../../core';

const LIST_CNFS_BY_REGION_USE_CASE: ListCnfsByRegionUseCase = {
  execute$(): Observable<CnfsByRegion[]> {
    return of([
      new CnfsByRegion(new Coordinates(43.955, 6.053333), {
        count: 2,
        region: "Provence-Alpes-Côte d'Azur"
      }),
      new CnfsByRegion(new Coordinates(49.966111, 2.775278), {
        count: 7,
        region: 'Hauts-de-France'
      })
    ]);
  }
} as ListCnfsByRegionUseCase;

describe('cartography presenter', (): void => {
  it('should present list of cnfs by region positions', async (): Promise<void> => {
    const expectedCnfsByRegionPositions: FeatureCollection<Point, CnfsByRegionProperties> = {
      features: [
        {
          geometry: {
            coordinates: [6.053333, 43.955],
            type: 'Point'
          },
          properties: {
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
            count: 7,
            region: 'Hauts-de-France'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
      {} as ListCnfsPositionUseCase,
      LIST_CNFS_BY_REGION_USE_CASE,
      {} as GeocodeAddressUseCase,
      {} as ClusterService
    );

    const cnfsByRegionPositions: FeatureCollection<Point, CnfsByRegionProperties> = await firstValueFrom(
      cartographyPresenter.listCnfsByRegionPositions$()
    );

    expect(cnfsByRegionPositions).toStrictEqual(expectedCnfsByRegionPositions);
  });
});
