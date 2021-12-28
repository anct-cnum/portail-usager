import { Cnfs } from '../../../../core';
import { Feature, FeatureCollection, Point } from 'geojson';
import {
  CnfsGeoJsonProperties, CnfsProperties,
  StructureGeoJsonProperties
} from "../../../../../../environments/environment.model";

// TODO TEST !
const cnfsArrayToGeoJsonFeatures = (cnfsArray: Cnfs[]): Feature<Point, CnfsGeoJsonProperties>[] =>
  cnfsArray.map(
    (singleCnfs: Cnfs): Feature<Point, CnfsGeoJsonProperties> => ({
      geometry: {
        coordinates: [singleCnfs.position.latitude, singleCnfs.position.longitude],
        type: 'Point'
      },
      properties: {
        conseiller: { ...singleCnfs.properties['conseiller'] as CnfsProperties },
        structure: { ...singleCnfs.properties['structure'] as StructureGeoJsonProperties }
      },
      type: 'Feature'
    })
  );

export const cnfsCoreToPresentation = (cnfs: Cnfs[]): FeatureCollection<Point, CnfsGeoJsonProperties> => ({
  features: cnfsArrayToGeoJsonFeatures(cnfs),
  type: 'FeatureCollection'
});
