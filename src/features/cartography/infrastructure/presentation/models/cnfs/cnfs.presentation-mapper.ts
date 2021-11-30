import type { Cnfs } from '../../../../core';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { AvailableMarkers } from '../../../configuration';
import type { MarkerProperties } from './cnfs.presentation-model';

const cnfsArrayToGeoJsonFeatures = (cnfsArray: Cnfs[]): Feature<Point>[] =>
  cnfsArray.map(
    (singleCnfs: Cnfs): Feature<Point> => ({
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

export const cnfsCoreToPresentation = (cnfs: Cnfs[]): FeatureCollection<Point> => ({
  features: cnfsArrayToGeoJsonFeatures(cnfs),
  type: 'FeatureCollection'
});

export const featureGeoJsonToMarker = (
  feature: Feature<Point>,
  markerIconConfiguration: AvailableMarkers
): Feature<Point, MarkerProperties> => ({
  ...feature,
  ...{ properties: { ...{ markerIconConfiguration } } }
});
