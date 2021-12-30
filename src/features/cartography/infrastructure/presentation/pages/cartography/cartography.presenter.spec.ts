import {
  CartographyPresenter,
  coordinatesToCenterView,
  permanenceMarkerEventToCenterView,
  departmentOrRegionMarkerEventToCenterView
} from './cartography.presenter';
import { ListCnfsPositionUseCase, ListCnfsByRegionUseCase, ListCnfsByDepartementUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BBox, Feature, FeatureCollection, Point } from 'geojson';
import {
  Cnfs,
  CnfsByDepartement,
  CnfsByDepartementProperties,
  CnfsByRegion,
  CnfsByRegionProperties,
  Coordinates
} from '../../../../core';
import { CenterView, CnfsPermanenceProperties, MarkerEvent, StructurePresentation } from '../../models';
import { ViewBox } from '../../directives/leaflet-map-state-change';
import { SPLIT_REGION_ZOOM } from './cartography.page';
import { emptyFeatureCollection } from '../../helpers';

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

const LIST_CNFS_BY_DEPARTEMENT_USE_CASE: ListCnfsByDepartementUseCase = {
  execute$(): Observable<CnfsByDepartement[]> {
    return of([
      new CnfsByDepartement(new Coordinates(46.099798450280282, 5.348666025399395), {
        boundingZoom: 10,
        code: '01',
        count: 12,
        departement: 'Ain'
      }),
      new CnfsByDepartement(new Coordinates(-12.820655090736881, 45.147364453253317), {
        boundingZoom: 10,
        code: '976',
        count: 27,
        departement: 'Mayotte'
      })
    ]);
  }
} as ListCnfsByDepartementUseCase;

const LIST_CNFS_POSITION_USE_CASE: ListCnfsPositionUseCase = {
  execute$(): Observable<Cnfs[]> {
    return of([
      new Cnfs(new Coordinates(45.734377, 4.816864), {
        cnfs: {
          email: 'john.doe@conseiller-numerique.fr',
          name: 'John Doe'
        },
        structure: {
          address: '12 rue des Acacias, 69002 Lyon',
          isLabeledFranceServices: false,
          name: 'Association des centres sociaux et culturels de Lyon',
          phone: '0456789012',
          type: 'association'
        }
      }),
      new Cnfs(new Coordinates(43.305645, 5.380007), {
        cnfs: {
          email: 'mary.doe@conseiller-numerique.fr',
          name: 'Mary Doe'
        },
        structure: {
          address: '31 Avenue de la mer, 13003 Marseille',
          isLabeledFranceServices: true,
          name: 'Médiathèque de la mer',
          phone: '0478563641',
          type: ''
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
        cnfs: [
          {
            email: 'janette.smith@conseiller-numerique.fr',
            name: 'Janette Smith'
          }
        ],
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
        cnfs: [
          {
            email: 'henry.doe@conseiller-numerique.fr',
            name: 'Henry Doe'
          }
        ],
        structure: {
          address: 'RUE DU MOULIN, 32000 GRENOBLE',
          isLabeledFranceServices: false,
          name: 'Mairie de grenoble',
          phone: '0561828555',
          type: 'Mairie'
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
        cnfs: [
          {
            email: 'charles.doe@conseiller-numerique.fr',
            name: 'Charles Doe'
          }
        ],
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
        {} as ListCnfsByDepartementUseCase,
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
        {} as ListCnfsByDepartementUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const cnfsByRegionPositions: FeatureCollection<Point, CnfsByRegionProperties> = await firstValueFrom(
        cartographyPresenter.listCnfsByRegionPositions$()
      );

      expect(cnfsByRegionPositions).toStrictEqual(expectedCnfsByRegionPositions);
    });
  });
  describe('cnsf by departement', (): void => {
    it('should present list of cnfs by departement positions', async (): Promise<void> => {
      const expectedCnfsByDepartementPositions: FeatureCollection<Point, CnfsByDepartementProperties> = {
        features: [
          {
            geometry: {
              coordinates: [5.348666025399395, 46.09979845028028],
              type: 'Point'
            },
            properties: {
              boundingZoom: 10,
              code: '01',
              count: 12,
              departement: 'Ain'
            },
            type: 'Feature'
          },
          {
            geometry: {
              coordinates: [45.14736445325332, -12.820655090736881],
              type: 'Point'
            },
            properties: {
              boundingZoom: 10,
              code: '976',
              count: 27,
              departement: 'Mayotte'
            },
            type: 'Feature'
          }
        ],
        type: 'FeatureCollection'
      };

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as ListCnfsPositionUseCase,
        {} as ListCnfsByRegionUseCase,
        LIST_CNFS_BY_DEPARTEMENT_USE_CASE,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const cnfsByDepartementPositions: FeatureCollection<Point, CnfsByDepartementProperties> = await firstValueFrom(
        cartographyPresenter.listCnfsByDepartementPositions$()
      );

      expect(cnfsByDepartementPositions).toStrictEqual(expectedCnfsByDepartementPositions);
    });
  });

  describe('center view', (): void => {
    it('should map a markerEvent for a cnfs by region to a CenterView', (): void => {
      const palaisDeLElyseeCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

      const markerEvent: MarkerEvent<CnfsByRegionProperties> = {
        eventType: 'click',
        markerPosition: palaisDeLElyseeCoordinates,
        markerProperties: {
          boundingZoom: 8,
          count: 6,
          region: 'Auvergne'
        }
      };

      const expectedCenterView: CenterView = {
        coordinates: palaisDeLElyseeCoordinates,
        zoomLevel: 8
      };

      expect(departmentOrRegionMarkerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
    });

    it('should map a markerEvent for a cnfs permanence to a CenterView', (): void => {
      const palaisDeLElyseeCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

      const markerEvent: MarkerEvent<CnfsPermanenceProperties> = {
        eventType: 'click',
        markerPosition: palaisDeLElyseeCoordinates,
        markerProperties: {
          cnfs: [],
          structure: {
            address: '12 rue des Acacias, 69002 Lyon',
            isLabeledFranceServices: false,
            name: 'Association des centres sociaux et culturels de Lyon',
            phone: '0456789012',
            type: 'association'
          }
        }
      };

      const expectedCenterView: CenterView = {
        coordinates: palaisDeLElyseeCoordinates,
        zoomLevel: 12
      };

      expect(permanenceMarkerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
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
        {} as ListCnfsByDepartementUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const viewBox$: Observable<ViewBox> = of({
        boundingBox: {} as BBox,
        zoomLevel: SPLIT_REGION_ZOOM - 1
      });

      const cnfsPositions$: Observable<FeatureCollection<Point, CnfsPermanenceProperties>> = of(
        CNFS_PERMANENCE_FEATURE_COLLECTION
      );

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(viewBox$, cnfsPositions$)
      );

      expect(structuresList).toStrictEqual([]);
    });

    it(`should be empty if map position features properties are not of type CnfsPermanenceProperties`, async (): Promise<void> => {
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as ListCnfsPositionUseCase,
        {} as ListCnfsByRegionUseCase,
        {} as ListCnfsByDepartementUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const viewBox$: Observable<ViewBox> = of({
        boundingBox: {} as BBox,
        zoomLevel: SPLIT_REGION_ZOOM - 1
      });

      const cnfsPositions$: Observable<FeatureCollection<Point, CnfsByRegionProperties>> = of({
        features: [
          {
            geometry: {
              coordinates: [1.302737, 43.760536],
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
              coordinates: [1.302737, 43.760536],
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
      });

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(viewBox$, cnfsPositions$)
      );

      expect(structuresList).toStrictEqual([]);
    });

    it('should list all received structures if zoom is equal or superior to split zoom level', async (): Promise<void> => {
      const expectedStructureList: StructurePresentation[] = [
        {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        },
        {
          address: 'RUE DU MOULIN, 32000 GRENOBLE',
          isLabeledFranceServices: false,
          name: 'Mairie de grenoble',
          phone: '0561828555',
          type: 'Mairie'
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

      const receivedCnfsPermanences$: Observable<FeatureCollection<Point, CnfsPermanenceProperties>> = of(
        CNFS_PERMANENCE_FEATURE_COLLECTION
      );

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as ListCnfsPositionUseCase,
        {} as ListCnfsByRegionUseCase,
        {} as ListCnfsByDepartementUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(viewBox$, receivedCnfsPermanences$)
      );

      expect(structuresList).toStrictEqual(expectedStructureList);
    });
  });
});
