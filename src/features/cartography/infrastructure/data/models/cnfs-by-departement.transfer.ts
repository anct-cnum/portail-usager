import { Feature, FeatureCollection, Point } from 'geojson';

export interface CnfsByDepartementTransferProperties {
  boundingZoom: number;
  count: number;
  codeDepartement: string;
  nomDepartement: string;
}

export interface CnfsByDepartementTransfer extends FeatureCollection {
  features: Feature<Point, CnfsByDepartementTransferProperties>[];
}
