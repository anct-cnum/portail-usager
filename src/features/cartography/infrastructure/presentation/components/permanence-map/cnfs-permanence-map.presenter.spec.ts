import { ListCnfsUseCase } from '../../../../use-cases';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Cnfs, Coordinates } from '../../../../core';
import { FeatureCollection, Point } from 'geojson';
import { CnfsPermanenceMarkerProperties } from '../../models';
import { MarkerKey } from '../../../configuration';
import { DEPARTMENT_ZOOM_LEVEL } from '../../helpers/map-constants';
import { CnfsPermanenceMapPresenter } from './cnfs-permanence-map.presenter';
import { MapViewCullingService } from '../../services/map-view-culling.service';

describe('cnfs permanence map presenter', (): void => {
  it('should display cnfs permanences at department zoom level if marker display is forced', async (): Promise<void> => {
    const forceCnfsPermanenceDisplay$: Observable<boolean> = of(true);

    const listCnfsUseCase: ListCnfsUseCase = {
      execute$(): Observable<Cnfs[]> {
        return of([
          new Cnfs(new Coordinates(4.33889, -50.125782), {
            address: '31 Avenue de la mer, 13003 Cayenne',
            id: '4c38ebc9a06fdd532bf9d7be',
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
            coordinates: [-50.125782, 4.33889],
            type: 'Point'
          },
          properties: {
            address: '31 Avenue de la mer, 13003 Cayenne',
            id: '4c38ebc9a06fdd532bf9d7be',
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

    cartographyPresenter.setViewportAndZoom({
      viewport: [-55, 1, -49, 5],
      zoomLevel: DEPARTMENT_ZOOM_LEVEL
    });

    const visibleMapPointsOfInterest: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = await firstValueFrom(
      cartographyPresenter.visibleMapCnfsPermanencesThroughViewportAtZoomLevel$(forceCnfsPermanenceDisplay$)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsPermanenceMarkersFeatures);
  });

  it('should display all cnfs permanences if zoomed more than the department level', async (): Promise<void> => {
    const listCnfsUseCase: ListCnfsUseCase = {
      execute$(): Observable<Cnfs[]> {
        return of([
          new Cnfs(new Coordinates(45.734377, 4.816864), {
            address: '12 rue des Acacias, 69002 Lyon',
            id: '4c38ebc9a06fdd532bf9d7be',
            isLabeledFranceServices: false,
            name: 'Association des centres sociaux et culturels de Lyon'
          }),
          new Cnfs(new Coordinates(43.305645, 5.380007), {
            address: '31 Avenue de la mer, 13003 Marseille',
            id: '88bc36fb0db191928330b1e6',
            isLabeledFranceServices: true,
            name: 'Médiathèque de la mer'
          })
        ]);
      }
    } as ListCnfsUseCase;

    const cartographyPresenter: CnfsPermanenceMapPresenter = new CnfsPermanenceMapPresenter(
      listCnfsUseCase,
      new MapViewCullingService()
    );

    const expectedCnfsPermanenceMarkersFeatures: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = {
      features: [
        {
          geometry: {
            coordinates: [4.816864, 45.734377],
            type: 'Point'
          },
          properties: {
            address: '12 rue des Acacias, 69002 Lyon',
            id: '4c38ebc9a06fdd532bf9d7be',
            isLabeledFranceServices: false,
            markerType: MarkerKey.CnfsPermanence,
            name: 'Association des centres sociaux et culturels de Lyon'
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [5.380007, 43.305645],
            type: 'Point'
          },
          properties: {
            address: '31 Avenue de la mer, 13003 Marseille',
            id: '88bc36fb0db191928330b1e6',
            isLabeledFranceServices: true,
            markerType: MarkerKey.CnfsPermanence,
            name: 'Médiathèque de la mer'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    cartographyPresenter.setViewportAndZoom({
      viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
      zoomLevel: DEPARTMENT_ZOOM_LEVEL + 1
    });

    const visibleMapPointsOfInterest: FeatureCollection<Point, CnfsPermanenceMarkerProperties> = await firstValueFrom(
      cartographyPresenter.visibleMapCnfsPermanencesThroughViewportAtZoomLevel$()
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsPermanenceMarkersFeatures);
  });
});
