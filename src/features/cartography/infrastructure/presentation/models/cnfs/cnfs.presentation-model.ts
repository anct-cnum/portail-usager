import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Marker } from '../../../configuration';

export type MarkerProperties = GeoJsonProperties & { markerIconConfiguration: Marker };

export const EMPTY_FEATURE_COLLECTION: FeatureCollection<Point, MarkerProperties> = {
  features: [],
  type: 'FeatureCollection'
};

export interface MarkersPresentation extends FeatureCollection {
  features: Feature<Point, MarkerProperties>[];
}
