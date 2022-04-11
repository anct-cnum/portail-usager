import { ListCnfsUseCase } from '../../../../use-cases';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Cnfs, Coordinates } from '../../../../core';
import { FeatureCollection, Point } from 'geojson';
import { CnfsPermanenceMarkerProperties } from '../../models';
import { MarkerKey } from '../../../configuration';
import { DEPARTMENT_ZOOM_LEVEL } from '../../helpers/map-constants';
import { CnfsPermanenceMapPresenter } from './cnfs-permanence-map.presenter';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { MapChange } from './permanence-map.utils';

describe('cnfs permanence map presenter', (): void => {
  it('should display cnfs permanences markers at city zoom level', async (): Promise<void> => {
    const listCnfsUseCase: ListCnfsUseCase = {
      execute$(): Observable<Cnfs[]> {
        return of([
          new Cnfs(new Coordinates(43.305645, 5.380007), {
            address: '31 Avenue de la mer, 13003 Marseille',
            id: '88bc36fb0db191928330b1e6',
            isLabeledAidantsConnect: true,
            isLabeledFranceServices: true,
            name: 'Médiathèque de la mer'
          }),
          new Cnfs(new Coordinates(45.734377, 4.816864), {
            address: '12 rue des Acacias, 69002 Lyon',
            id: '4c38ebc9a06fdd532bf9d7be',
            isLabeledAidantsConnect: true,
            isLabeledFranceServices: false,
            name: 'Association des centres sociaux et culturels de Lyon'
          })
        ]);
      }
    } as ListCnfsUseCase;

    const expectedCnfsPermanenceMarkersFeatures: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = {
      features: [
        {
          geometry: {
            coordinates: [5.380007, 43.305645],
            type: 'Point'
          },
          properties: {
            address: '31 Avenue de la mer, 13003 Marseille',
            id: '88bc36fb0db191928330b1e6',
            isLabeledAidantsConnect: true,
            isLabeledFranceServices: true,
            markerType: MarkerKey.CnfsPermanence,
            name: 'Médiathèque de la mer'
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [4.816864, 45.734377],
            type: 'Point'
          },
          properties: {
            address: '12 rue des Acacias, 69002 Lyon',
            id: '4c38ebc9a06fdd532bf9d7be',
            isLabeledAidantsConnect: true,
            isLabeledFranceServices: false,
            markerType: MarkerKey.CnfsPermanence,
            name: 'Association des centres sociaux et culturels de Lyon'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const cartographyPresenter: CnfsPermanenceMapPresenter = new CnfsPermanenceMapPresenter(
      listCnfsUseCase,
      new MapViewCullingService()
    );

    const mapChange: MapChange = [
      {
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL + 1
      },
      false
    ];

    const visibleMapPointsOfInterest: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = await firstValueFrom(
      cartographyPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsPermanenceMarkersFeatures);
  });

  it('should display cnfs permanences markers at department zoom level when marker display is forced', async (): Promise<void> => {
    const listCnfsUseCase: ListCnfsUseCase = {
      execute$(): Observable<Cnfs[]> {
        return of([
          new Cnfs(new Coordinates(43.305645, 5.380007), {
            address: '31 Avenue de la mer, 13003 Marseille',
            id: '88bc36fb0db191928330b1e6',
            isLabeledAidantsConnect: true,
            isLabeledFranceServices: true,
            name: 'Médiathèque de la mer'
          })
        ]);
      }
    } as ListCnfsUseCase;

    const expectedCnfsPermanenceMarkersFeatures: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = {
      features: [
        {
          geometry: {
            coordinates: [5.380007, 43.305645],
            type: 'Point'
          },
          properties: {
            address: '31 Avenue de la mer, 13003 Marseille',
            id: '88bc36fb0db191928330b1e6',
            isLabeledAidantsConnect: true,
            isLabeledFranceServices: true,
            markerType: MarkerKey.CnfsPermanence,
            name: 'Médiathèque de la mer'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const cartographyPresenter: CnfsPermanenceMapPresenter = new CnfsPermanenceMapPresenter(
      listCnfsUseCase,
      new MapViewCullingService()
    );

    const mapChange: MapChange = [
      {
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      },
      true
    ];

    const visibleMapPointsOfInterest: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = await firstValueFrom(
      cartographyPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsPermanenceMarkersFeatures);
  });

  it('should not display cnfs permanences markers at other zoom level than city', async (): Promise<void> => {
    const listCnfsUseCase: ListCnfsUseCase = {
      execute$(): Observable<Cnfs[]> {
        return of([
          new Cnfs(new Coordinates(43.305645, 5.380007), {
            address: '31 Avenue de la mer, 13003 Marseille',
            id: '88bc36fb0db191928330b1e6',
            isLabeledAidantsConnect: true,
            isLabeledFranceServices: true,
            name: 'Médiathèque de la mer'
          })
        ]);
      }
    } as ListCnfsUseCase;

    const expectedCnfsPermanenceMarkersFeatures: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = {
      features: [],
      type: 'FeatureCollection'
    };

    const cartographyPresenter: CnfsPermanenceMapPresenter = new CnfsPermanenceMapPresenter(
      listCnfsUseCase,
      new MapViewCullingService()
    );

    const mapChange: MapChange = [
      {
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      },
      false
    ];

    const visibleMapPointsOfInterest: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = await firstValueFrom(
      cartographyPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsPermanenceMarkersFeatures);
  });
});
