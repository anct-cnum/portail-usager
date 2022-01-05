import { CartographyPresenter } from './cartography.presenter';
import {
  CnfsDetailsUseCase,
  GeocodeAddressUseCase,
  ListCnfsByDepartmentUseCase,
  ListCnfsByRegionUseCase,
  ListCnfsUseCase
} from '../../../../use-cases';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Feature, Point } from 'geojson';
import {
  Cnfs,
  CnfsByDepartment,
  CnfsByDepartmentProperties,
  CnfsByRegion,
  CnfsByRegionProperties,
  CnfsDetails,
  Coordinates,
  StructureContact
} from '../../../../core';
import {
  CenterView,
  CnfsDetailsPresentation,
  CnfsPermanenceProperties,
  DayPresentation,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  StructurePresentation
} from '../../models';
import { ViewportAndZoom } from '../../directives/leaflet-map-state-change';
import { Marker } from '../../../configuration';
import {
  boundedMarkerEventToCenterView,
  coordinatesToCenterView,
  permanenceMarkerEventToCenterView
} from '../../models/center-view/center-view.presentation-mapper';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';

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

const CNFS_DETAILS_USE_CASE: CnfsDetailsUseCase = {
  execute$(): Observable<CnfsDetails> {
    return of(
      new CnfsDetails(
        2,
        'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
        ['9h30 - 17h30', '9h30 - 17h30', '9h30 - 17h30', '9h30 - 17h30', '9h30 - 17h30', '9h30 - 12h00'],
        'Place José Moron 3200 RIOM',
        new StructureContact('email@example.com', '03 86 55 26 40', 'https://www.test.com')
      )
    );
  }
} as CnfsDetailsUseCase;

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
        {} as CnfsDetailsUseCase,
        LIST_CNFS_BY_REGION_USE_CASE,
        LIST_CNFS_BY_DEPARTMENT_USE_CASE,
        LIST_CNFS_USE_CASE,
        {} as GeocodeAddressUseCase,
        {} as MapViewCullingService
      );

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkerProperties>[] = await firstValueFrom(
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
        {} as CnfsDetailsUseCase,
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

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkerProperties>[] = await firstValueFrom(
        cartographyPresenter.visibleMapPointsOfInterestThroughViewportAtZoomLevel$(viewportAndZoom$)
      );

      expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByDepartmentFeatures);
    });

    it('should display cnfs permanences at department zoom level if marker display is forced', async (): Promise<void> => {
      const forceCnfsPermanenceDisplay$: Observable<boolean> = of(true);
      const viewCullingService: MapViewCullingService = new MapViewCullingService();
      const listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase = {
        execute$(): Observable<CnfsByDepartment[]> {
          return of([
            new CnfsByDepartment(new Coordinates(3.922060670769425, -53.237712294069844), {
              boundingZoom: 10,
              code: '973',
              count: 27,
              department: 'Guyane'
            })
          ]);
        }
      } as ListCnfsByDepartmentUseCase;

      const listCnfsUseCase: ListCnfsUseCase = {
        execute$(): Observable<Cnfs[]> {
          return of([
            new Cnfs(new Coordinates(4.33889, -50.125782), {
              cnfs: {
                email: 'mary.doe@conseiller-numerique.fr',
                name: 'Mary Doe'
              },
              structure: {
                address: '31 Avenue de la mer, 13003 Cayenne',
                isLabeledFranceServices: true,
                name: 'Médiathèque de la mer',
                phone: '0478563641',
                type: ''
              }
            })
          ]);
        }
      } as ListCnfsUseCase;

      const expectedCnfsPermanenceMarkersFeatures: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = [
        {
          geometry: {
            coordinates: [-50.125782, 4.33889],
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
              address: '31 Avenue de la mer, 13003 Cayenne',
              isLabeledFranceServices: true,
              name: 'Médiathèque de la mer',
              phone: '0478563641',
              type: ''
            }
          },
          type: 'Feature'
        }
      ];

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        LIST_CNFS_BY_REGION_USE_CASE,
        listCnfsByDepartmentUseCase,
        listCnfsUseCase,
        {} as GeocodeAddressUseCase,
        viewCullingService
      );

      const viewportAndZoom$: Observable<ViewportAndZoom> = of({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        viewport: [-55, 1, -49, 5],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      });

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkerProperties>[] = await firstValueFrom(
        cartographyPresenter.visibleMapPointsOfInterestThroughViewportAtZoomLevel$(
          viewportAndZoom$,
          forceCnfsPermanenceDisplay$
        )
      );

      expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsPermanenceMarkersFeatures);
    });

    it('should display cnfs by department at depatment zoom level if marker display is not forced', async (): Promise<void> => {
      const forceCnfsPermanenceDisplay$: Observable<boolean> = of(false);
      const viewCullingService: MapViewCullingService = new MapViewCullingService();
      const listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase = {
        execute$(): Observable<CnfsByDepartment[]> {
          return of([
            new CnfsByDepartment(new Coordinates(3.922060670769425, -53.237712294069844), {
              boundingZoom: 10,
              code: '973',
              count: 27,
              department: 'Guyane'
            })
          ]);
        }
      } as ListCnfsByDepartmentUseCase;

      const listCnfsUseCase: ListCnfsUseCase = {
        execute$(): Observable<Cnfs[]> {
          return of([
            new Cnfs(new Coordinates(4.33889, -50.125782), {
              cnfs: {
                email: 'mary.doe@conseiller-numerique.fr',
                name: 'Mary Doe'
              },
              structure: {
                address: '31 Avenue de la mer, 13003 Cayenne',
                isLabeledFranceServices: true,
                name: 'Médiathèque de la mer',
                phone: '0478563641',
                type: ''
              }
            })
          ]);
        }
      } as ListCnfsUseCase;

      const expectedCnfsByDepartmentMarkersFeatures: Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[] = [
        {
          geometry: {
            coordinates: [-53.237712294069844, 3.922060670769425],
            type: 'Point'
          },
          properties: {
            boundingZoom: 10,
            code: '973',
            count: 27,
            department: 'Guyane',
            markerType: Marker.CnfsByDepartment
          },
          type: 'Feature'
        }
      ];

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        LIST_CNFS_BY_REGION_USE_CASE,
        listCnfsByDepartmentUseCase,
        listCnfsUseCase,
        {} as GeocodeAddressUseCase,
        viewCullingService
      );

      const viewportAndZoom$: Observable<ViewportAndZoom> = of({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        viewport: [-55, 1, -49, 5],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      });

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkerProperties>[] = await firstValueFrom(
        cartographyPresenter.visibleMapPointsOfInterestThroughViewportAtZoomLevel$(
          viewportAndZoom$,
          forceCnfsPermanenceDisplay$
        )
      );

      expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByDepartmentMarkersFeatures);
    });

    it('should display all cnfs permanences if zoomed more than the department level', async (): Promise<void> => {
      const viewCullingService: MapViewCullingService = new MapViewCullingService();
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
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

      const visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkerProperties>[] = await firstValueFrom(
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

      expect(boundedMarkerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
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
    it(`should be empty if markers to display are not CnfsPermanence`, async (): Promise<void> => {
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
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

      const viewportAndZoom$: Observable<ViewportAndZoom> = of({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: REGION_ZOOM_LEVEL
      });

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(viewportAndZoom$)
      );

      expect(structuresList).toStrictEqual([]);
    });

    it('should be the structures of the visible Cnfs permanences', async (): Promise<void> => {
      const expectedStructureList: StructurePresentation[] = [
        {
          address: '12 rue des Acacias, 69002 Lyon',
          isLabeledFranceServices: false,
          name: 'Association des centres sociaux et culturels de Lyon',
          phone: '0456789012',
          type: 'association'
        },
        {
          address: '31 Avenue de la mer, 13003 Marseille',
          isLabeledFranceServices: true,
          name: 'Médiathèque de la mer',
          phone: '0478563641',
          type: ''
        }
      ];

      const viewportAndZoom$: Observable<ViewportAndZoom> = of({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL + 1
      });

      const viewCullingService: MapViewCullingService = new MapViewCullingService();
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
        {
          execute$: (): Observable<CnfsByRegion[]> => of([])
        } as unknown as ListCnfsByRegionUseCase,
        {
          execute$: (): Observable<CnfsByDepartment[]> => of([])
        } as unknown as ListCnfsByDepartmentUseCase,
        LIST_CNFS_USE_CASE,
        {} as GeocodeAddressUseCase,
        viewCullingService
      );

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(viewportAndZoom$)
      );

      expect(structuresList).toStrictEqual(expectedStructureList);
    });
  });

  it('should get cnfs details', async (): Promise<void> => {
    const expectedCnfsDetails: CnfsDetailsPresentation = {
      address: 'Place José Moron 3200 RIOM',
      cnfsNumber: 2,
      email: 'email@example.com',
      opening: [
        {
          day: DayPresentation.Monday,
          hours: '9h30 - 17h30'
        },
        {
          day: DayPresentation.Tuesday,
          hours: '9h30 - 17h30'
        },
        {
          day: DayPresentation.Wednesday,
          hours: '9h30 - 17h30'
        },
        {
          day: DayPresentation.Thursday,
          hours: '9h30 - 17h30'
        },
        {
          day: DayPresentation.Friday,
          hours: '9h30 - 17h30'
        },
        {
          day: DayPresentation.Saturday,
          hours: '9h30 - 12h00'
        }
      ],
      phone: '03 86 55 26 40',
      structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
      website: 'https://www.test.com'
    };

    const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
      CNFS_DETAILS_USE_CASE,
      LIST_CNFS_BY_REGION_USE_CASE,
      LIST_CNFS_BY_DEPARTMENT_USE_CASE,
      LIST_CNFS_USE_CASE,
      {} as GeocodeAddressUseCase,
      {} as MapViewCullingService
    );

    const cnfsDetails: CnfsDetailsPresentation = await firstValueFrom(cartographyPresenter.cnfsDetails$());

    expect(cnfsDetails).toStrictEqual(expectedCnfsDetails);
  });
});
