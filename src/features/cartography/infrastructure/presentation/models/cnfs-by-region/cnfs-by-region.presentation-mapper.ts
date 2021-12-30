import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegion, CnfsByRegionProperties } from '../../../../core';

const listCnfsByRegionToGeoJsonFeatures = (cnfsByRegions: CnfsByRegion[]): Feature<Point, CnfsByRegionProperties>[] =>
  cnfsByRegions.map(
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
  cnfsByRegions: CnfsByRegion[]
): FeatureCollection<Point, CnfsByRegionProperties> => ({
  features: listCnfsByRegionToGeoJsonFeatures(cnfsByRegions),
  type: 'FeatureCollection'
});
