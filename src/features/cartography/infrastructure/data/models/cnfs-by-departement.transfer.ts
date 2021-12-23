import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByDepartementProperties } from '../../../core';

export interface CnfsByDepartementTransfer extends FeatureCollection {
  features: Feature<Point, CnfsByDepartementProperties>[];
}
