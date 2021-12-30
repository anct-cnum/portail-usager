import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegionProperties } from '../../../core';

export interface CnfsByRegionTransfer extends FeatureCollection {
  features: Feature<Point, CnfsByRegionProperties>[];
}
