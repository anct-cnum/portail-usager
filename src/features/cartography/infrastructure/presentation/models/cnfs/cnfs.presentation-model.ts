import type { Feature, FeatureCollection, Point } from 'geojson';

export interface CnfsPresentation extends FeatureCollection {
  features: Feature<Point>[];
}
