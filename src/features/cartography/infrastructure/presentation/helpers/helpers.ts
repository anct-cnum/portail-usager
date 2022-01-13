import { Feature, FeatureCollection, Point } from 'geojson';
import { Coordinates } from '../../../core';
import { TypedMarker } from '../models';
import { Marker } from '../../configuration';

export const emptyFeatureCollection = <T>(): FeatureCollection<Point, T> => ({
  features: [],
  type: 'FeatureCollection'
});

export const usagerFeatureFromCoordinates = (coordinates: Coordinates): Feature<Point, TypedMarker> => ({
  geometry: {
    coordinates: [coordinates.longitude, coordinates.latitude],
    type: 'Point'
  },
  properties: {
    markerType: Marker.Usager,
    zIndexOffset: 1000
  },
  type: 'Feature'
});
