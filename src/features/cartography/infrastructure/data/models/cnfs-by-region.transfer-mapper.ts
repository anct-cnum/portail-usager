import {Feature, Point} from 'geojson';
import {CnfsByRegion, CnfsByRegionProperties, Coordinates} from '../../../core';
import {CnfsByRegionTransfer} from './cnfs-by-region.transfer';

const hasValidCoordinates = (feature: Feature<Point>): boolean =>
  Coordinates.isValidLatitudeAngle(feature.geometry.coordinates[0]) &&
  Coordinates.isValidLongitudeAngle(feature.geometry.coordinates[1]);

export const cnfsByRegionTransferToCore = (cnfsTransfer: CnfsByRegionTransfer): CnfsByRegion[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsByRegionProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsByRegionProperties>): CnfsByRegion =>
        new CnfsByRegion(new Coordinates(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties)
    );
