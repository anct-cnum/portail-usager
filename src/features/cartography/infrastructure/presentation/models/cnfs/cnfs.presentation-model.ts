import type { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import type { AvailableMarkers } from '../../../configuration';

export type MarkerProperties = GeoJsonProperties & { markerIconConfiguration: AvailableMarkers };

export const EMPTY_COLLECTION: FeatureCollection<Point, MarkerProperties> = {
  features: [],
  type: 'FeatureCollection'
};

export interface MarkersPresentation extends FeatureCollection {
  features: Feature<Point, MarkerProperties>[];
}
