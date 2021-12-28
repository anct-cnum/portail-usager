import { FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';
import { Coordinates } from '../../../../core';

export type MarkerProperties = AnyGeoJsonProperty & {
  markerIconConfiguration: Marker;
  zIndexOffset?: number;
};

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

export const emptyFeatureCollection = <T>(): FeatureCollection<Point, T> => ({
  features: [],
  type: 'FeatureCollection'
});
