import { Feature, FeatureCollection, Point } from 'geojson';

export interface CnfsByDepartmentTransferProperties {
  boundingZoom: number;
  count: number;
  codeDepartement: string;
  nomDepartement: string;
}

export interface CnfsByDepartmentTransfer extends FeatureCollection {
  features: Feature<Point, CnfsByDepartmentTransferProperties>[];
}
