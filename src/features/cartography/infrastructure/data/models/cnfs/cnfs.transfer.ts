import { Feature, FeatureCollection, Point } from 'geojson';
export interface CnfsTransferProperties {
  id: string;
  name: string;
  isLabeledFranceServices?: boolean;
  address?: string;
}

export interface CnfsTransfer extends FeatureCollection {
  features: Feature<Point, CnfsTransferProperties>[];
}
