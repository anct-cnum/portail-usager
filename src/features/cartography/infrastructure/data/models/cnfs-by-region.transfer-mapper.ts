import { Feature, Point, Position } from 'geojson';
import { CnfsByRegion, CnfsByRegionProperties, Coordinates } from '../../../core';
import { CnfsByRegionTransfer } from './cnfs-by-region.transfer';

const hasValidCoordinates = (feature: Feature<Point>): boolean => {
  const [longitude, latitude]: Position = feature.geometry.coordinates;
  return Coordinates.isValidLatitudeAngle(latitude) && Coordinates.isValidLongitudeAngle(longitude);
};

export const cnfsByRegionTransferToCore = (cnfsTransfer: CnfsByRegionTransfer): CnfsByRegion[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsByRegionProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsByRegionProperties>): CnfsByRegion =>
        new CnfsByRegion(new Coordinates(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties)
    );
