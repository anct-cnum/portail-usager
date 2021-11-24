/*
 * TODO REVIEW IGNORE
 *  mapper temporaire qui récupère la première valeur en attendant d'avoir un typeahead
 */
import { Coordinates } from '../../../core';
import type { Point, FeatureCollection } from 'geojson';

export const featureCollectionToFirstCoordinates = (featureCollection: FeatureCollection<Point>): Coordinates =>
  new Coordinates(featureCollection.features[0].geometry.coordinates[1], featureCollection.features[0].geometry.coordinates[0]);
