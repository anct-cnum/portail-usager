import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegionProperties } from "../../../../../environments/environment.model";

export interface CnfsByRegionTransfer extends FeatureCollection {
  features: Feature<Point, CnfsByRegionProperties>[];
}
