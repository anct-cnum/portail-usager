import type { Coordinates } from '../../../core';

// TODO Deprecated after passing configuration through injected token
export interface MapOptionsPresentation {
  centerCoordinates: Coordinates;
  zoomLevel: number;
}
