import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { MarkerProperties } from '../models';
import { Marker } from '../../configuration';
import type { Coordinates } from '../../../core';

const usagerFeatureMarker = (usagerCoordinates: Coordinates): Feature<Point, MarkerProperties> => ({
  geometry: {
    coordinates: [usagerCoordinates.longitude, usagerCoordinates.latitude],
    type: 'Point'
  },
  properties: {
    markerIconConfiguration: Marker.Usager
  },
  type: 'Feature'
});

@Pipe({ name: 'addUsagerMarker' })
export class AddUsagerMarker implements PipeTransform {
  public transform(
    visibleMarkersCollection: FeatureCollection<Point, MarkerProperties>,
    usagerCoordinates?: Coordinates | null
  ): FeatureCollection<Point, MarkerProperties> {
    if (usagerCoordinates == null) return visibleMarkersCollection;

    const features: Feature<Point, MarkerProperties>[] = [
      ...visibleMarkersCollection.features,
      usagerFeatureMarker(usagerCoordinates)
    ];

    return { ...visibleMarkersCollection, features };
  }
}
