import { Cnfs, Coordinates } from '../../../core';
import { CnfsTransfer } from './cnfs.transfer';
import { Point, Feature, Position } from 'geojson';
import { CnfsProperties, CnfsTransferProperties, StructureProperties } from '../../../../../environments/environment.model';

const hasValidCoordinates = (feature: Feature<Point>): boolean => {
  const [longitude, latitude]: Position = feature.geometry.coordinates;
  return Coordinates.isValidLatitudeAngle(latitude) && Coordinates.isValidLongitudeAngle(longitude);
};

const transferToCoreProperties = (
  featureProperties: CnfsTransferProperties
): { cnfs: CnfsProperties; structure: StructureProperties } => ({
  cnfs: {
    email: featureProperties.conseiller.email,
    name: featureProperties.conseiller.name
  },
  structure: {
    address: featureProperties.structure.address ?? '',
    isLabeledFranceServices: featureProperties.structure.isLabeledFranceServices ?? false,
    name: featureProperties.structure.name ?? '',
    phone: featureProperties.structure.phone ?? '',
    type: featureProperties.structure.type ?? ''
  }
});

export const cnfsTransferToCore = (cnfsTransfer: CnfsTransfer): Cnfs[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsTransferProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsTransferProperties>): Cnfs =>
        new Cnfs(
          new Coordinates(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
          transferToCoreProperties(feature.properties)
        )
    );
