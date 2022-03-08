import { ListCnfsByRegionUseCase } from '../../../../use-cases';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CnfsByRegion, Coordinates } from '../../../../core';
import { FeatureCollection, Point } from 'geojson';
import { CnfsByRegionMarkerProperties } from '../../models';
import { MarkerKey } from '../../../configuration';
import { RegionPermanenceMapPresenter } from './region-permanence-map.presenter';

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
  it('should display the cnfs grouped by region markers at the region zoom level', async (): Promise<void> => {
    const expectedCnfsByRegionFeatures: FeatureCollection<Point, CnfsByRegionMarkerProperties> = {
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

    const visibleMapPointsOfInterest: FeatureCollection<Point, CnfsByRegionMarkerProperties> = await firstValueFrom(
      regionPermanenceMapPresenter.visibleMapCnfsByRegionAtZoomLevel$()
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByRegionFeatures);
  });
});
