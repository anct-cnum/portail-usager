import { Cnfs, CnfsPermanence, Coordinates } from '../../../../core';
import { CnfsTransfer, CnfsTransferProperties } from './cnfs.transfer';
import { Point, Feature, Position } from 'geojson';

const hasValidCoordinates = (feature: Feature<Point>): boolean => {
  const [longitude, latitude]: Position = feature.geometry.coordinates;
  return Coordinates.isValidLatitudeAngle(latitude) && Coordinates.isValidLongitudeAngle(longitude);
};

const transferToCoreProperties = (featureProperties: CnfsTransferProperties): CnfsPermanence => ({
  address: featureProperties.address ?? '',
  id: featureProperties.id,
  isLabeledFranceServices: featureProperties.isLabeledFranceServices ?? false,
  name: featureProperties.name
});

export const cnfsTransferToCore = (cnfsTransfer: CnfsTransfer): Cnfs[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsTransferProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsTransferProperties>): Cnfs =>
        new Cnfs(Coordinates.fromGeoJsonFeature(feature), transferToCoreProperties(feature.properties))
    );
