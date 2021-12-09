import { Feature, FeatureCollection, Point } from 'geojson';
import { AnyGeoJsonProperty } from '../../../../../environments/environment.model';

export interface CnfsTransfer extends FeatureCollection {
  features: Feature<Point, AnyGeoJsonProperty>[];
}
