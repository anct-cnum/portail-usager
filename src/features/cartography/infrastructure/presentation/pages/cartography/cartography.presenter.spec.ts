import { CartographyPresenter, coordinatesToCenterView, markerEventToCenterView } from './cartography.presenter';
import { ListCnfsPositionUseCase, ListCnfsByRegionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { ClusterService } from '../../services/cluster.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { FeatureCollection, Point } from 'geojson';
import { Cnfs, CnfsByRegion, Coordinates } from '../../../../core';
import { CenterView, MarkerEvent, StructurePresentation } from '../../models';
import { CnfsByRegionProperties } from '../../../../../../environments/environment.model';

const LIST_CNFS_BY_REGION_USE_CASE: ListCnfsByRegionUseCase = {
  execute$(): Observable<CnfsByRegion[]> {
    return of([
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
    ]);
  }
} as ListCnfsByRegionUseCase;

const LIST_CNFS_POSITION_USE_CASE: ListCnfsPositionUseCase = {
  execute$(): Observable<Cnfs[]> {
    return of([
      new Cnfs(new Coordinates(45.734377, 4.816864), {
        conseiller: {
          email: 'john.doe@conseiller-numerique.fr',
          name: 'John Doe'
        },
        structure: {
          address: '12 rue des Acacias, 69002 Lyon',
          isLabeledFranceServices: false,
          name: 'Association des centres sociaux et culturels de Lyon',
          phone: '0456789012'
        }
      }),
      new Cnfs(new Coordinates(43.305645, 5.380007), {
        conseiller: {
          email: 'mary.doe@conseiller-numerique.fr',
          name: 'Mary Doe'
        },
        structure: {
          address: '31 Avenue de la mer, 13003 Marseille',
          isLabeledFranceServices: true,
          name: 'Médiathèque de la mer',
          phone: '0478563641'
        }
      })
    ]);
  }
} as ListCnfsPositionUseCase;

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

  it('should map a markerEvent to a CenterView', (): void => {
    const palaisDeLElyseeCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

    const markerEvent: MarkerEvent = {
      eventType: 'click',
      markerPosition: palaisDeLElyseeCoordinates,
      markerProperties: {
        boundingZoom: 8
      }
    };

    const expectedCenterView: CenterView = {
      coordinates: palaisDeLElyseeCoordinates,
      zoomLevel: 8
    };

    expect(markerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
  });

  it('should create a CenterView from map coordinates', (): void => {
    const usagerCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

    const expectedCenterView: CenterView = {
      coordinates: usagerCoordinates,
      zoomLevel: 12
    };

    expect(coordinatesToCenterView(usagerCoordinates)).toStrictEqual(expectedCenterView);
  });

  it('should list structures', async (): Promise<void> => {
    const expectedStructureList: StructurePresentation[] = [
      {
        address: '12 rue des Acacias, 69002 Lyon',
        name: 'Association des centres sociaux et culturels de Lyon',
        type: ''
      },
      {
        address: '31 Avenue de la mer, 13003 Marseille',
        name: 'Médiathèque de la mer',
        type: ''
      }
    ];

    const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
      LIST_CNFS_POSITION_USE_CASE,
      {} as ListCnfsByRegionUseCase,
      {} as GeocodeAddressUseCase,
      {} as ClusterService
    );

    const structuresList: StructurePresentation[] = await firstValueFrom(cartographyPresenter.structuresList$());

    expect(structuresList).toStrictEqual(expectedStructureList);
  });
});
