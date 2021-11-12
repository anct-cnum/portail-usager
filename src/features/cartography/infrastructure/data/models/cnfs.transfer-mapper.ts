import { Cnfs, Coordinates } from '../../../core';
import type { CnfsTransfer } from './cnfs.transfer';
import type { Point, Feature } from 'geojson';

export const cnfsTransferToCore = (cnfsTransfer: CnfsTransfer): Cnfs[] =>
  cnfsTransfer.features.map(
    (feature: Feature<Point>): Cnfs =>
      new Cnfs(new Coordinates(feature.geometry.coordinates[0], feature.geometry.coordinates[1]), feature.properties)
  );
