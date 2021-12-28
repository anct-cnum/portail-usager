import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegion } from '../../../../core';
import { CnfsByRegionProperties } from '../../../../../../environments/environment.model';

const listCnfsByRegionToGeoJsonFeatures = (listCnfsByRegion: CnfsByRegion[]): Feature<Point, CnfsByRegionProperties>[] =>
  listCnfsByRegion.map(
    (cnfsByRegion: CnfsByRegion): Feature<Point, CnfsByRegionProperties> => ({
      geometry: {
        coordinates: [cnfsByRegion.position.longitude, cnfsByRegion.position.latitude],
        type: 'Point'
      },
      properties: {
        boundingZoom: cnfsByRegion.properties.boundingZoom,
        count: cnfsByRegion.properties.count,
        region: cnfsByRegion.properties.region
      },
      type: 'Feature'
    })
  );

export const listCnfsByRegionToPresentation = (
  listCnfsByRegion: CnfsByRegion[]
): FeatureCollection<Point, CnfsByRegionProperties> => ({
  features: listCnfsByRegionToGeoJsonFeatures(listCnfsByRegion),
  type: 'FeatureCollection'
});
