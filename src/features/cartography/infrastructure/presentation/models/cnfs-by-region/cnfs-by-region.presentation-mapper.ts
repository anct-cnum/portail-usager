import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegion } from '../../../../core';
import { MarkerProperties } from '../cnfs';
import { Marker } from '../../../configuration';

const listCnfsByRegionToGeoJsonFeatures = (listCnfsByRegion: CnfsByRegion[]): Feature<Point, MarkerProperties>[] =>
  listCnfsByRegion.map(
    (cnfsByRegion: CnfsByRegion): Feature<Point, MarkerProperties> => ({
      geometry: {
        coordinates: [cnfsByRegion.position.longitude, cnfsByRegion.position.latitude],
        type: 'Point'
      },
      properties: {
        markerIconConfiguration: Marker.CnfsByRegion,
        ...cnfsByRegion.properties
      },
      type: 'Feature'
    })
  );

export const listCnfsByRegionToPresentation = (
  listCnfsByRegion: CnfsByRegion[]
): FeatureCollection<Point, MarkerProperties> => ({
  features: listCnfsByRegionToGeoJsonFeatures(listCnfsByRegion),
  type: 'FeatureCollection'
});
