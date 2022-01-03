import {
  CartographyPresenter,
  coordinatesToCenterView,
  regionMarkerEventToCenterView,
  permanenceMarkerEventToCenterView,
  REGION_ZOOM_LEVEL,
  DEPARTMENT_ZOOM_LEVEL
} from './cartography.presenter';
import { ListCnfsByDepartmentUseCase, ListCnfsByRegionUseCase, ListCnfsUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Feature, Point } from 'geojson';
import {
  Cnfs,
  CnfsByDepartment,
  CnfsByDepartmentProperties,
  CnfsByRegion,
  CnfsByRegionProperties,
  Coordinates
} from '../../../../core';
import {
  CenterView,
  CnfsPermanenceProperties,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkers,
  StructurePresentation
} from '../../models';
import { ViewportAndZoom } from '../../directives/leaflet-map-state-change';
import { Marker } from '../../../configuration';

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

const LIST_CNFS_BY_DEPARTMENT_USE_CASE: ListCnfsByDepartmentUseCase = {
  execute$(): Observable<CnfsByDepartment[]> {
    return of([
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
    ]);
  }
} as ListCnfsByDepartmentUseCase;

const LIST_CNFS_USE_CASE: ListCnfsUseCase = {
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
} as ListCnfsUseCase;

const CNFS_PERMANENCE_MARKERS_FEATURES: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = [
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
      markerType: Marker.CnfsPermanence,
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
      markerType: Marker.CnfsPermanence,
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
      markerType: Marker.CnfsPermanence,
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
];

describe('cartography presenter', (): void => {
  describe('visible point of interest markers', (): void => {
    it('should display the cnfs grouped by region markers at the region zoom level', async (): Promise<void> => {
      const expectedCnfsByRegionFeatures: Feature<Point, MarkerProperties<CnfsByRegionProperties>>[] = [
        {
          geometry: {
            coordinates: [6.053333, 43.955],
            type: 'Point'
          },
          properties: {
            boundingZoom: 8,
            count: 2,
            markerType: Marker.CnfsByRegion,
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
            markerType: Marker.CnfsByRegion,
            region: 'Hauts-de-France'
          },
          type: 'Feature'
        }
      ];

      const viewportAndZoom$: Observable<ViewportAndZoom> = of({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: REGION_ZOOM_LEVEL
      });

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        LIST_CNFS_BY_REGION_USE_CASE,
        LIST_CNFS_BY_DEPARTMENT_USE_CASE,
        LIST_CNFS_USE_CASE,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkers>[] = await firstValueFrom(
        cartographyPresenter.visibleMapPointsOfInterestThroughViewportAtZoomLevel$(viewportAndZoom$)
      );

      expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByRegionFeatures);
    });

    it('should be cnfs by department at the department zoom level', async (): Promise<void> => {
      const expectedCnfsByDepartmentFeatures: Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[] = [
        {
          geometry: {
            coordinates: [5.348666025399395, 46.09979845028028],
            type: 'Point'
          },
          properties: {
            boundingZoom: 10,
            code: '01',
            count: 12,
            department: 'Ain',
            markerType: Marker.CnfsByDepartment
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
            department: 'Mayotte',
            markerType: Marker.CnfsByDepartment
          },
          type: 'Feature'
        }
      ];

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        LIST_CNFS_BY_REGION_USE_CASE,
        LIST_CNFS_BY_DEPARTMENT_USE_CASE,
        LIST_CNFS_USE_CASE,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const viewportAndZoom$: Observable<ViewportAndZoom> = of({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      });

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkers>[] = await firstValueFrom(
        cartographyPresenter.visibleMapPointsOfInterestThroughViewportAtZoomLevel$(viewportAndZoom$)
      );

      expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByDepartmentFeatures);
    });

    it('should display all cnfs permanences if zoomed more than the department level', async (): Promise<void> => {
      const viewCullingService: MapViewCullingService = new MapViewCullingService();
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        LIST_CNFS_BY_REGION_USE_CASE,
        LIST_CNFS_BY_DEPARTMENT_USE_CASE,
        LIST_CNFS_USE_CASE,
        {} as GeocodeAddressUseCase,
        viewCullingService
      );

      const expectedCnfsPermanenceMarkersFeatures: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = [
        {
          geometry: {
            coordinates: [4.816864, 45.734377],
            type: 'Point'
          },
          properties: {
            cnfs: [
              {
                email: 'john.doe@conseiller-numerique.fr',
                name: 'John Doe'
              }
            ],
            markerType: Marker.CnfsPermanence,
            structure: {
              address: '12 rue des Acacias, 69002 Lyon',
              isLabeledFranceServices: false,
              name: 'Association des centres sociaux et culturels de Lyon',
              phone: '0456789012',
              type: 'association'
            }
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [5.380007, 43.305645],
            type: 'Point'
          },
          properties: {
            cnfs: [
              {
                email: 'mary.doe@conseiller-numerique.fr',
                name: 'Mary Doe'
              }
            ],
            markerType: Marker.CnfsPermanence,
            structure: {
              address: '31 Avenue de la mer, 13003 Marseille',
              isLabeledFranceServices: true,
              name: 'Médiathèque de la mer',
              phone: '0478563641',
              type: ''
            }
          },
          type: 'Feature'
        }
      ];

      const viewportAndZoom$: Observable<ViewportAndZoom> = of({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL + 1
      });

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkers>[] = await firstValueFrom(
        cartographyPresenter.visibleMapPointsOfInterestThroughViewportAtZoomLevel$(viewportAndZoom$)
      );

      expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsPermanenceMarkersFeatures);
    });
  });

  describe('center view', (): void => {
    it('should map a markerEvent for a cnfs by region to a CenterView', (): void => {
      const palaisDeLElyseeCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

      const markerEvent: MarkerEvent<MarkerProperties<CnfsByRegionProperties>> = {
        eventType: 'click',
        markerPosition: palaisDeLElyseeCoordinates,
        markerProperties: {
          boundingZoom: 8,
          count: 6,
          markerType: Marker.CnfsByRegion,
          region: 'Auvergne'
        }
      };

      const expectedCenterView: CenterView = {
        coordinates: palaisDeLElyseeCoordinates,
        zoomLevel: 8
      };

      expect(regionMarkerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
    });

    it('should map a markerEvent for a cnfs permanence to a CenterView', (): void => {
      const palaisDeLElyseeCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

      const markerEvent: MarkerEvent<MarkerProperties<CnfsPermanenceProperties>> = {
        eventType: 'click',
        markerPosition: palaisDeLElyseeCoordinates,
        markerProperties: {
          cnfs: [],
          markerType: Marker.CnfsPermanence,
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
    it(`should emit empty array if map position features properties are not of type CnfsPermanenceProperties`, async (): Promise<void> => {
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {
          execute$: (): Observable<CnfsByRegion[]> => of([])
        } as unknown as ListCnfsByRegionUseCase,
        {
          execute$: (): Observable<CnfsByDepartment[]> => of([])
        } as unknown as ListCnfsByDepartmentUseCase,
        {
          execute$: (): Observable<Cnfs[]> => of([])
        } as unknown as ListCnfsUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const cnfsByRegionPositionWithMarkerProperties$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
        of([
          {
            geometry: {
              coordinates: [1.302737, 43.760536],
              type: 'Point'
            },
            properties: {
              boundingZoom: 8,
              count: 2,
              markerType: Marker.CnfsByRegion,
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
              markerType: Marker.CnfsByRegion,
              region: 'Hauts-de-France'
            },
            type: 'Feature'
          }
        ]);

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(cnfsByRegionPositionWithMarkerProperties$)
      );

      expect(structuresList).toStrictEqual([]);
    });

    it('should list all received structures', async (): Promise<void> => {
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

      const receivedCnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
        of(CNFS_PERMANENCE_MARKERS_FEATURES);

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {
          execute$: (): Observable<CnfsByRegion[]> => of([])
        } as unknown as ListCnfsByRegionUseCase,
        {
          execute$: (): Observable<CnfsByDepartment[]> => of([])
        } as unknown as ListCnfsByDepartmentUseCase,
        {
          execute$: (): Observable<Cnfs[]> => of([])
        } as unknown as ListCnfsUseCase,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(receivedCnfsPermanences$)
      );

      expect(structuresList).toStrictEqual(expectedStructureList);
    });
  });
});
