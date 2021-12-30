import { Cnfs } from '../../../../core';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsPermanenceProperties } from './cnfs-permanence.presentation';

const cnfsArrayToGeoJsonFeatures = (cnfsArray: Cnfs[]): Feature<Point, CnfsPermanenceProperties>[] =>
  cnfsArray.map(
    (singleCnfs: Cnfs): Feature<Point, CnfsPermanenceProperties> => ({
      geometry: {
        coordinates: [singleCnfs.position.longitude, singleCnfs.position.latitude],
        type: 'Point'
      },
      properties: {
        cnfs: [{ ...singleCnfs.properties.cnfs }],
        structure: { ...singleCnfs.properties.structure }
      },
      type: 'Feature'
    })
  );

export const cnfsCoreToCnfsPermanenceFeatureCollection = (
  cnfs: Cnfs[]
): FeatureCollection<Point, CnfsPermanenceProperties> => ({
  features: cnfsArrayToGeoJsonFeatures(cnfs),
  type: 'FeatureCollection'
});
