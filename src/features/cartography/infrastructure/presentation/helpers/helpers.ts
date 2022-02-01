import { Feature, FeatureCollection, Point } from 'geojson';
import { Coordinates } from '../../../core';
import { UsagerMarkerProperties } from '../models';
import { MarkerKey } from '../../configuration';

export const emptyFeatureCollection = <T>(): FeatureCollection<Point, T> => ({
  features: [],
  type: 'FeatureCollection'
});

export const usagerFeatureFromCoordinates = (coordinates: Coordinates): Feature<Point, UsagerMarkerProperties> => ({
  geometry: {
    coordinates: [coordinates.longitude, coordinates.latitude],
    type: 'Point'
  },
  properties: {
    markerType: MarkerKey.Usager,
    zIndexOffset: 1000
  },
  type: 'Feature'
});
