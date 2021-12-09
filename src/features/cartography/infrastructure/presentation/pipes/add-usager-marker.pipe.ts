import { Pipe, PipeTransform } from '@angular/core';
import { Feature, FeatureCollection, Point } from 'geojson';
import { MarkerProperties } from '../models';
import { Marker } from '../../configuration';
import { Coordinates } from '../../../core';

const usagerFeatureMarker = (usagerCoordinates: Coordinates): Feature<Point, MarkerProperties> => ({
  geometry: {
    coordinates: [usagerCoordinates.longitude, usagerCoordinates.latitude],
    type: 'Point'
  },
  properties: {
    markerIconConfiguration: Marker.Usager,
    zIndexOffset: 1000
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
