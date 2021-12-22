import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';
import { Coordinates } from '../../../../core';

export type MarkerProperties = GeoJsonProperties & { markerIconConfiguration: Marker };

export interface CenterView {
  coordinates: Coordinates;
  zoomLevel: number;
}

export interface MarkerEvent {
  eventType: string;
  markerProperties: AnyGeoJsonProperty;
  markerPosition: Coordinates;
}

export type MarkersPresentation = FeatureCollection<Point, MarkerProperties>;

export const EMPTY_FEATURE_COLLECTION: MarkersPresentation = {
  features: [],
  type: 'FeatureCollection'
};
