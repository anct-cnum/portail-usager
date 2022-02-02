import { Coordinates } from '../../../../core';
import { Point, Feature } from 'geojson';

export type CoordinatesTransfer = Feature<Point, { address: string }>[];

export const toFirstCoordinates = (feature: Feature<Point>[]): Coordinates | null =>
  feature.length > 0 ? Coordinates.fromGeoJsonFeature(feature[0]) : null;
