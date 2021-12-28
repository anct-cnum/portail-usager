import { Cnfs } from '../../../../core';
import { Feature, FeatureCollection, Point } from 'geojson';
import {
  CnfsPermanenceProperties,
  CnfsProperties,
  StructureProperties
} from '../../../../../../environments/environment.model';

const cnfsArrayToGeoJsonFeatures = (cnfsArray: Cnfs[]): Feature<Point, CnfsPermanenceProperties>[] =>
  cnfsArray.map(
    (singleCnfs: Cnfs): Feature<Point, CnfsPermanenceProperties> => ({
      geometry: {
        coordinates: [singleCnfs.position.latitude, singleCnfs.position.longitude],
        type: 'Point'
      },
      properties: {
        cnfs: { ...(singleCnfs.properties['cnfs'] as CnfsProperties) },
        structure: { ...(singleCnfs.properties['structure'] as StructureProperties) }
      },
      type: 'Feature'
    })
  );

export const cnfsCoreToPresentation = (cnfs: Cnfs[]): FeatureCollection<Point, CnfsPermanenceProperties> => ({
  features: cnfsArrayToGeoJsonFeatures(cnfs),
  type: 'FeatureCollection'
});
