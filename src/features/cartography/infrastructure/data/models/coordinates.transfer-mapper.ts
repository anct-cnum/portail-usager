/*
 * TODO REVIEW IGNORE
 *  mapper temporaire qui récupère la première valeur en attendant d'avoir un typeahead
 */
import { Coordinates } from '../../../core';
import { Point, FeatureCollection } from 'geojson';

export const featureCollectionToFirstCoordinates = (featureCollection: FeatureCollection<Point>): Coordinates =>
  Coordinates.fromGeoJsonFeature(featureCollection.features[0]);
