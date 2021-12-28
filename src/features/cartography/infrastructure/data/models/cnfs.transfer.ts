import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsTransferProperties } from '../../../../../environments/environment.model';

export interface CnfsTransfer extends FeatureCollection {
  features: Feature<Point, CnfsTransferProperties>[];
}
