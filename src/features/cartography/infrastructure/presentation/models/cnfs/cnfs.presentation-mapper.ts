import { Cnfs } from '../../../../core';
import { Feature, FeatureCollection, Point } from 'geojson';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';

const cnfsArrayToGeoJsonFeatures = (cnfsArray: Cnfs[]): Feature<Point, AnyGeoJsonProperty>[] =>
  cnfsArray.map(
    (singleCnfs: Cnfs): Feature<Point, AnyGeoJsonProperty> => ({
      geometry: {
        coordinates: [singleCnfs.position.latitude, singleCnfs.position.longitude],
        type: 'Point'
      },
      properties: {
        ...singleCnfs.properties
      },
      type: 'Feature'
    })
  );

export const cnfsCoreToPresentation = (cnfs: Cnfs[]): FeatureCollection<Point, AnyGeoJsonProperty> => ({
  features: cnfsArrayToGeoJsonFeatures(cnfs),
  type: 'FeatureCollection'
});
