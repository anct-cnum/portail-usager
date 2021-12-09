import { Cnfs, Coordinates } from '../../../core';
import { CnfsTransfer } from './cnfs.transfer';
import { Point, Feature } from 'geojson';
import { AnyGeoJsonProperty } from '../../../../../environments/environment.model';

const hasValidCoordinates = (feature: Feature<Point>): boolean =>
  Coordinates.isValidLatitudeAngle(feature.geometry.coordinates[0]) &&
  Coordinates.isValidLongitudeAngle(feature.geometry.coordinates[1]);

export const cnfsTransferToCore = (cnfsTransfer: CnfsTransfer): Cnfs[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, AnyGeoJsonProperty>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, AnyGeoJsonProperty>): Cnfs =>
        new Cnfs(new Coordinates(feature.geometry.coordinates[0], feature.geometry.coordinates[1]), feature.properties)
    );
