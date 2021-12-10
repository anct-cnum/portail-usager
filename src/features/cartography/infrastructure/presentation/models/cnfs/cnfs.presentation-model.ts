import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';

export type MarkerProperties = GeoJsonProperties & { markerIconConfiguration: Marker };

export interface MarkerEvent {
  eventType: string;
  markerProperties: AnyGeoJsonProperty;
}

export const EMPTY_FEATURE_COLLECTION: FeatureCollection<Point, MarkerProperties> = {
  features: [],
  type: 'FeatureCollection'
};

export interface MarkersPresentation extends FeatureCollection {
  features: Feature<Point, MarkerProperties>[];
}
