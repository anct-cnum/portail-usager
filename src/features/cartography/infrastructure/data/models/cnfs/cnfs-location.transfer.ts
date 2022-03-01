import { Feature, Point } from 'geojson';

export interface CnfsLocationTransfer extends Feature<Point> {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}
