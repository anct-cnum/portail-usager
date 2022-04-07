import { Cnfs, CnfsPermanence, Coordinates } from '../../../../core';
import { CnfsTransfer, CnfsTransferProperties } from './cnfs.transfer';
import { Feature, Point, Position } from 'geojson';

const hasValidCoordinates = (feature: Feature<Point>): boolean => {
  const [longitude, latitude]: Position = feature.geometry.coordinates;
  return Coordinates.isValidLatitudeAngle(latitude) && Coordinates.isValidLongitudeAngle(longitude);
};

const getOpeningHours = (openingHours?: string[]): Pick<CnfsPermanence, 'openingHours'> =>
  openingHours == null
    ? {}
    : {
        openingHours
      };

const transferToCoreProperties = (feature: Feature<Point, CnfsTransferProperties>): CnfsPermanence => ({
  address: feature.properties.address ?? '',
  id: feature.properties.id,
  isLabeledFranceServices: feature.properties.isLabeledFranceServices ?? false,
  name: feature.properties.name,
  position: Coordinates.fromGeoJsonFeature(feature),
  ...getOpeningHours(feature.properties.openingHours)
});

export const cnfsTransferToCore = (cnfsTransfer: CnfsTransfer): Cnfs[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsTransferProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsTransferProperties>): Cnfs =>
        new Cnfs(Coordinates.fromGeoJsonFeature(feature), transferToCoreProperties(feature))
    );
