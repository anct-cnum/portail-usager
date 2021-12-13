import {Feature, FeatureCollection, Point} from 'geojson';
import {CnfsByRegion, CnfsByRegionProperties} from '../../../../core';

const listCnfsByRegionToGeoJsonFeatures = (listCnfsByRegion: CnfsByRegion[]): Feature<Point, CnfsByRegionProperties>[] =>
  listCnfsByRegion.map(
    (cnfsByRegion: CnfsByRegion): Feature<Point, CnfsByRegionProperties> => ({
      geometry: {
        coordinates: [cnfsByRegion.position.longitude, cnfsByRegion.position.latitude],
        type: 'Point'
      },
      properties: {
        ...cnfsByRegion.properties
      },
      type: 'Feature'
    })
  );

export const listCnfsByRegionToPresentation = (listCnfsByRegion: CnfsByRegion[]): FeatureCollection<Point, CnfsByRegionProperties> => ({
  features: listCnfsByRegionToGeoJsonFeatures(listCnfsByRegion),
  type: 'FeatureCollection'
});
