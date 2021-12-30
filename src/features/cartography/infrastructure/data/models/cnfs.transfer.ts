import { Feature, FeatureCollection, Point } from 'geojson';
export interface CnfsTransferProperties {
  conseiller: {
    name: string;
    email: string;
  };
  structure: {
    name?: string;
    isLabeledFranceServices?: boolean;
    address?: string;
    phone?: string;
    type?: string;
  };
}

export interface CnfsTransfer extends FeatureCollection {
  features: Feature<Point, CnfsTransferProperties>[];
}
