// TODO Mieux gérer la logique d'attribution des marqueurs
import { Feature, Point } from 'geojson';
import { Marker } from '../../configuration';
import { MarkerProperties } from '../models';
import { AnyGeoJsonProperty } from '../../../../../environments/environment.model';

export const mergeProperties = (
  properties: AnyGeoJsonProperty,
  marker: Marker
): AnyGeoJsonProperty & { markerIconConfiguration: Marker } => ({
  ...properties,
  ...{ markerIconConfiguration: properties['cluster'] === true ? marker : Marker.Cnfs }
});

export const setMarkerIcon =
  (marker: Marker): ((feature: Feature<Point, AnyGeoJsonProperty>) => Feature<Point, MarkerProperties>) =>
  (feature: Feature<Point, AnyGeoJsonProperty>): Feature<Point, MarkerProperties> => ({
    ...feature,
    ...{ properties: mergeProperties(feature.properties, marker) }
  });
