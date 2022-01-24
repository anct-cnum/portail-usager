import { Coordinates } from '../../../../core';
import { Point, Feature } from 'geojson';

export type CoordinatesTransfer = Feature<Point, { address: string }>[];

export const coordinatesTransferToFirstCoordinates = (feature: Feature<Point>[]): Coordinates =>
  Coordinates.fromGeoJsonFeature(feature[0]);
