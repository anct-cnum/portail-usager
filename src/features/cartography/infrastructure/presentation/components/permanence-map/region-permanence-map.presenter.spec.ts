import { ListCnfsByRegionUseCase } from '../../../../use-cases';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CnfsByRegion, Coordinates } from '../../../../core';
import { MarkerKey } from '../../../configuration';
import { CnfsByRegionFeatureCollection, RegionPermanenceMapPresenter } from './region-permanence-map.presenter';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { MapChange } from './permanence-map.utils';

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

describe('department permanence map presenter', (): void => {
  it('should display cnfs grouped by region markers at the region zoom level', async (): Promise<void> => {
    const expectedCnfsByRegionFeatures: CnfsByRegionFeatureCollection = {
      features: [
        {
          geometry: {
            coordinates: [6.053333, 43.955],
            type: 'Point'
          },
          properties: {
            boundingZoom: 8,
            count: 2,
            markerType: MarkerKey.CnfsByRegion,
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
            markerType: MarkerKey.CnfsByRegion,
            region: 'Hauts-de-France'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const regionPermanenceMapPresenter: RegionPermanenceMapPresenter = new RegionPermanenceMapPresenter(
      LIST_CNFS_BY_REGION_USE_CASE
    );

    const mapChange: MapChange = [
      {
        viewport: [-55, 1, -49, 5],
        zoomLevel: REGION_ZOOM_LEVEL
      },
      false
    ];

    const visibleMapPointsOfInterest: CnfsByRegionFeatureCollection = await firstValueFrom(
      regionPermanenceMapPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByRegionFeatures);
  });

  it('should not display cnfs grouped by region markers at other zoom level than region', async (): Promise<void> => {
    const expectedCnfsByRegionFeatures: CnfsByRegionFeatureCollection = {
      features: [],
      type: 'FeatureCollection'
    };

    const regionPermanenceMapPresenter: RegionPermanenceMapPresenter = new RegionPermanenceMapPresenter(
      LIST_CNFS_BY_REGION_USE_CASE
    );

    const mapChange: MapChange = [
      {
        viewport: [-55, 1, -49, 5],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      },
      false
    ];

    const visibleMapPointsOfInterest: CnfsByRegionFeatureCollection = await firstValueFrom(
      regionPermanenceMapPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByRegionFeatures);
  });

  it('should not display cnfs grouped by region markers when forced to display cnfs', async (): Promise<void> => {
    const expectedCnfsByRegionFeatures: CnfsByRegionFeatureCollection = {
      features: [],
      type: 'FeatureCollection'
    };

    const regionPermanenceMapPresenter: RegionPermanenceMapPresenter = new RegionPermanenceMapPresenter(
      LIST_CNFS_BY_REGION_USE_CASE
    );

    const mapChange: MapChange = [
      {
        viewport: [-55, 1, -49, 5],
        zoomLevel: REGION_ZOOM_LEVEL
      },
      true
    ];

    const visibleMapPointsOfInterest: CnfsByRegionFeatureCollection = await firstValueFrom(
      regionPermanenceMapPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByRegionFeatures);
  });
});
