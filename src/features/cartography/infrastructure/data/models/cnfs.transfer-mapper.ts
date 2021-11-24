import { Cnfs, Coordinates } from '../../../core';
import type { CnfsTransfer } from './cnfs.transfer';
import type { Point, Feature } from 'geojson';

const hasValidCoordinates = (feature: Feature<Point>): boolean =>
  Coordinates.isValidLatitudeAngle(feature.geometry.coordinates[0]) &&
  Coordinates.isValidLongitudeAngle(feature.geometry.coordinates[1]);

export const cnfsTransferToCore = (cnfsTransfer: CnfsTransfer): Cnfs[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point>): Cnfs =>
        new Cnfs(new Coordinates(feature.geometry.coordinates[0], feature.geometry.coordinates[1]), feature.properties)
    );
