import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByDepartement } from '../../../../core';
import { MarkerProperties } from '../cnfs';
import { Marker } from '../../../configuration';

const listCnfsByDepartementToGeoJsonFeatures = (listCnfsByDepartement: CnfsByDepartement[]): Feature<Point, MarkerProperties>[] =>
  listCnfsByDepartement.map(
    (cnfsByDepartement: CnfsByDepartement): Feature<Point, MarkerProperties> => ({
      geometry: {
        coordinates: [cnfsByDepartement.position.longitude, cnfsByDepartement.position.latitude],
        type: 'Point'
      },
      properties: {
        markerIconConfiguration: Marker.CnfsByDepartement,
        ...cnfsByDepartement.properties
      },
      type: 'Feature'
    })
  );

export const listCnfsByDepartementToPresentation = (
  listCnfsByDepartement: CnfsByDepartement[]
): FeatureCollection<Point, MarkerProperties> => ({
  features: listCnfsByDepartementToGeoJsonFeatures(listCnfsByDepartement),
  type: 'FeatureCollection'
});
