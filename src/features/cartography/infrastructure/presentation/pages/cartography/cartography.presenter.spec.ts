import { CartographyPresenter, coordinatesToCenterView, markerEventToCenterView } from './cartography.presenter';
import { ListCnfsPositionUseCase, ListCnfsByRegionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BBox, Feature, FeatureCollection, Point } from 'geojson';
import { Cnfs, CnfsByRegion, Coordinates } from '../../../../core';
import { CenterView, emptyFeatureCollection, MarkerEvent, StructurePresentation } from '../../models';
import { CnfsByRegionProperties, CnfsPermanenceProperties } from '../../../../../../environments/environment.model';
import { ViewBox } from '../../directives/leaflet-map-state-change';
import { SPLIT_REGION_ZOOM } from './cartography.page';

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

const CNFS_PERMANENCE_FEATURE_COLLECTION: FeatureCollection<Point, CnfsPermanenceProperties> = {
  features: [
    {
      geometry: {
        coordinates: [1.302737, 43.760536],
        type: 'Point'
      },
      properties: {
        cnfs: {
          email: 'sylvie.reynes@conseiller-numerique.fr',
          name: 'Sylvie Reynès'
        },
        structure: {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        }
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [1.302737, 43.760536],
        type: 'Point'
      },
      properties: {
        cnfs: {
          email: 'olivier.bouqueau@conseiller-numerique.fr',
          name: 'OLIVIER BOUQUEAU'
        },
        structure: {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        }
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [1.029654, 47.793923],
        type: 'Point'
      },
      properties: {
        cnfs: {
          email: 'romain.boussion@conseiller-numerique.fr',
          name: 'Romain Boussion'
        },
        structure: {
          address: 'PL LOUIS LEYGUE, 41100 NAVEIL',
          isLabeledFranceServices: false,
          name: 'COMMUNE DE NAVEIL',
          phone: '0254735757',
          type: 'association'
        }
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

describe('cartography presenter', (): void => {
  describe('list cnfs position', (): void => {
    it('should be empty if zoom is inferior to split zoom level', async (): Promise<void> => {
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        LIST_CNFS_POSITION_USE_CASE,
        {} as ListCnfsByRegionUseCase,
        {} as GeocodeAddressUseCase,
        {
          cull: (): Feature<Point, CnfsPermanenceProperties>[] => []
        } as unknown as MapViewCullingService
      );

      const viewBox$: Observable<ViewBox> = of({
        boundingBox: {} as BBox,
        zoomLevel: SPLIT_REGION_ZOOM - 1
      });

      const cnfsPositions: FeatureCollection<Point, CnfsPermanenceProperties> = await firstValueFrom(
        cartographyPresenter.listCnfsPositions$(viewBox$)
      );

      expect(cnfsPositions).toStrictEqual(emptyFeatureCollection<CnfsPermanenceProperties>());
    });
  });

  describe('cnsf by region', (): void => {
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
        {} as MapViewCullingService
      );

      const cnfsByRegionPositions: FeatureCollection<Point, CnfsByRegionProperties> = await firstValueFrom(
        cartographyPresenter.listCnfsByRegionPositions$()
      );

      expect(cnfsByRegionPositions).toStrictEqual(expectedCnfsByRegionPositions);
    });
  });

  describe('center view', (): void => {
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
  });

  describe('structures list', (): void => {
    it('should be empty if zoom is inferior to split zoom level', async (): Promise<void> => {
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as ListCnfsPositionUseCase,
        {} as ListCnfsByRegionUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const viewBox$: Observable<ViewBox> = of({
        boundingBox: {} as BBox,
        zoomLevel: SPLIT_REGION_ZOOM - 1
      });

      const cnfsPositions$: Observable<FeatureCollection<Point, CnfsPermanenceProperties>> = of(CNFS_PERMANENCE_FEATURE_COLLECTION);

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(viewBox$, cnfsPositions$)
      );

      expect(structuresList).toStrictEqual([]);
    });

    it('should list all visibles structures without aggregation if zoom is equal or superior to split zoom level', async (): Promise<void> => {
      const expectedStructureList: StructurePresentation[] = [
        {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        },
        {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        },
        {
          address: 'PL LOUIS LEYGUE, 41100 NAVEIL',
          isLabeledFranceServices: false,
          name: 'COMMUNE DE NAVEIL',
          phone: '0254735757',
          type: 'association'
        }
      ];

      const viewBox$: Observable<ViewBox> = of({
        boundingBox: {} as BBox,
        zoomLevel: SPLIT_REGION_ZOOM
      });

      const cnfsPositions$: Observable<FeatureCollection<Point, CnfsPermanenceProperties>> = of(CNFS_PERMANENCE_FEATURE_COLLECTION);

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as ListCnfsPositionUseCase,
        {} as ListCnfsByRegionUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(viewBox$, cnfsPositions$)
      );

      expect(structuresList).toStrictEqual(expectedStructureList);
    });
  });
});
