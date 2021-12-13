import { Point } from 'geojson';

export interface CartographyConfiguration {
  center: Point;
  zoomLevel: number;
}
