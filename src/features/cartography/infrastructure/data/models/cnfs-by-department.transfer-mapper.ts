import { Feature, Point, Position } from 'geojson';
import { CnfsByDepartment, CnfsByDepartmentProperties, Coordinates } from '../../../core';
import { CnfsByDepartmentTransfer, CnfsByDepartmentTransferProperties } from './cnfs-by-department.transfer';

const hasValidCoordinates = (feature: Feature<Point>): boolean => {
  const [longitude, latitude]: Position = feature.geometry.coordinates;
  return Coordinates.isValidLatitudeAngle(latitude) && Coordinates.isValidLongitudeAngle(longitude);
};

const transferToCoreProperties = (featureProperties: CnfsByDepartmentTransferProperties): CnfsByDepartmentProperties => ({
  boundingZoom: featureProperties.boundingZoom,
  code: featureProperties.codeDepartement,
  count: featureProperties.count,
  department: featureProperties.nomDepartement
});

export const cnfsByDepartmentTransferToCore = (cnfsTransfer: CnfsByDepartmentTransfer): CnfsByDepartment[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsByDepartmentTransferProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsByDepartmentTransferProperties>): CnfsByDepartment =>
        new CnfsByDepartment(Coordinates.fromGeoJsonFeature(feature), transferToCoreProperties(feature.properties))
    );
