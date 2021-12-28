import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegion } from '../../../../core';
import { CnfsByRegionGeoJsonProperties } from '../../../../../../environments/environment.model';

const listCnfsByRegionToGeoJsonFeatures = (listCnfsByRegion: CnfsByRegion[]): Feature<Point, CnfsByRegionGeoJsonProperties>[] =>
  listCnfsByRegion.map(
    (cnfsByRegion: CnfsByRegion): Feature<Point, CnfsByRegionGeoJsonProperties> => ({
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

export const listCnfsByRegionToPresentation = (
  listCnfsByRegion: CnfsByRegion[]
): FeatureCollection<Point, CnfsByRegionGeoJsonProperties> => ({
  features: listCnfsByRegionToGeoJsonFeatures(listCnfsByRegion),
  type: 'FeatureCollection'
});
