import { Feature, Point, Position } from 'geojson';
import { CnfsByDepartement, CnfsByDepartementProperties, Coordinates } from '../../../core';
import { CnfsByDepartementTransfer } from './cnfs-by-departement.transfer';

const hasValidCoordinates = (feature: Feature<Point>): boolean => {
  const [longitude, latitude]: Position = feature.geometry.coordinates;
  return Coordinates.isValidLatitudeAngle(latitude) && Coordinates.isValidLongitudeAngle(longitude);
};

export const cnfsByDepartementTransferToCore = (cnfsTransfer: CnfsByDepartementTransfer): CnfsByDepartement[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsByDepartementProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsByDepartementProperties>): CnfsByDepartement =>
        new CnfsByDepartement(new Coordinates(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), feature.properties)
    );
