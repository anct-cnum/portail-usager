import type { Cnfs } from '../../../../core';
import type { CnfsPresentation } from './cnfs.presentation-model';
import type { Feature, Point } from 'geojson';

const cnfsArrayToGeoJsonFeatures = (cnfsArray: Cnfs[]): Feature<Point>[] =>
  cnfsArray.map(
    (singleCnfs: Cnfs): Feature<Point> => ({
      geometry: {
        coordinates: [singleCnfs.position.latitude, singleCnfs.position.longitude],
        type: 'Point'
      },
      properties: {
        // TODO Iterate over properties if needed in core domain or just flat pass
      },
      type: 'Feature'
    })
  );

export const cnfsCoreToPresentation = (cnfs: Cnfs[]): CnfsPresentation => ({
  features: cnfsArrayToGeoJsonFeatures(cnfs),
  type: 'FeatureCollection'
});
