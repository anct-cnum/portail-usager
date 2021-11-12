import type { Feature, FeatureCollection, Point } from 'geojson';

export interface CnfsTransfer extends FeatureCollection {
  features: Feature<Point>[];
}
