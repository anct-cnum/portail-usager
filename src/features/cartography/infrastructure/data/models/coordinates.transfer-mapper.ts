import { Coordinates } from '../../../core';
import type { Point, FeatureCollection } from 'geojson';

export const featureCollectionToCoordinates = (featureCollection: FeatureCollection<Point>): Coordinates =>
  new Coordinates(featureCollection.features[0].geometry.coordinates[1], featureCollection.features[0].geometry.coordinates[0]);
