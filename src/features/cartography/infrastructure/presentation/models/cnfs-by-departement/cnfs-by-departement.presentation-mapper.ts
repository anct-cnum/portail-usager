import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByDepartement, CnfsByDepartementProperties } from '../../../../core';

// eslint-disable-next-line max-lines-per-function
const cnfsByDepartementToFeatures = (
  listCnfsByDepartement: CnfsByDepartement[]
): Feature<Point, CnfsByDepartementProperties>[] =>
  listCnfsByDepartement.map(
    (cnfsByDepartement: CnfsByDepartement): Feature<Point, CnfsByDepartementProperties> => ({
      geometry: {
        coordinates: [cnfsByDepartement.position.longitude, cnfsByDepartement.position.latitude],
        type: 'Point'
      },
      properties: cnfsByDepartement.properties,
      type: 'Feature'
    })
  );

export const cnfsByDepartementToPresentation = (
  cnfsByDepartements: CnfsByDepartement[]
): FeatureCollection<Point, CnfsByDepartementProperties> => ({
  features: cnfsByDepartementToFeatures(cnfsByDepartements),
  type: 'FeatureCollection'
});
