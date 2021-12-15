import { CartographyPresenter, coordinatesToCenterView, markerEventToCenterView } from './cartography.presenter';
import { ListCnfsPositionUseCase, ListCnfsByRegionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { ClusterService } from '../../services/cluster.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { FeatureCollection, Point } from 'geojson';
import { CnfsByRegion, Coordinates } from '../../../../core';
import { CenterView, MarkerEvent, MarkerProperties } from '../../models';
import { Marker } from '../../../configuration';

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
    const expectedCnfsByRegionPositions: FeatureCollection<Point, MarkerProperties> = {
      features: [
        {
          geometry: {
            coordinates: [6.053333, 43.955],
            type: 'Point'
          },
          properties: {
            count: 2,
            markerIconConfiguration: Marker.CnfsByRegion,
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
            markerIconConfiguration: Marker.CnfsByRegion,
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

    const cnfsByRegionPositions: FeatureCollection<Point, MarkerProperties> = await firstValueFrom(
      cartographyPresenter.listCnfsByRegionPositions$()
    );

    expect(cnfsByRegionPositions).toStrictEqual(expectedCnfsByRegionPositions);
  });

  it('should map a markerEvent to a CenterView', (): void => {
    const markerEvent: MarkerEvent = {
      eventType: 'click',
      markerPosition: new Coordinates(2.775278, 49.966111),
      markerProperties: {
        boundingZoom: 8
      }
    };

    const expectedCenterView: CenterView = {
      coordinates: new Coordinates(2.775278, 49.966111),
      zoomLevel: 8
    };

    expect(markerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
  });

  it('should create a CenterView from map coordinates', (): void => {
    const usagerCoordinates: Coordinates = new Coordinates(2.775278, 49.966111);

    const expectedCenterView: CenterView = {
      coordinates: new Coordinates(2.775278, 49.966111),
      zoomLevel: 12
    };

    expect(coordinatesToCenterView(usagerCoordinates)).toStrictEqual(expectedCenterView);
  });
});
