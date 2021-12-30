import { Feature, Point, Position } from 'geojson';
import {
  CnfsByDepartement,
  CnfsByDepartementProperties,
  Coordinates,
} from "../../../core";
import { CnfsByDepartementTransfer, CnfsByDepartementTransferProperties } from "./cnfs-by-departement.transfer";

const hasValidCoordinates = (feature: Feature<Point>): boolean => {
  const [longitude, latitude]: Position = feature.geometry.coordinates;
  return Coordinates.isValidLatitudeAngle(latitude) && Coordinates.isValidLongitudeAngle(longitude);
};

const transferToCoreProperties = (
  featureProperties: CnfsByDepartementTransferProperties
): CnfsByDepartementProperties => ({
  boundingZoom: featureProperties.boundingZoom,
  code: featureProperties.codeDepartement,
  count: featureProperties.count,
  departement: featureProperties.nomDepartement
});

export const cnfsByDepartementTransferToCore = (cnfsTransfer: CnfsByDepartementTransfer): CnfsByDepartement[] =>
  cnfsTransfer.features
    .filter((feature: Feature<Point, CnfsByDepartementTransferProperties>): boolean => hasValidCoordinates(feature))
    .map(
      (feature: Feature<Point, CnfsByDepartementTransferProperties>): CnfsByDepartement =>
        new CnfsByDepartement(new Coordinates(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
          transferToCoreProperties(feature.properties))
    );
