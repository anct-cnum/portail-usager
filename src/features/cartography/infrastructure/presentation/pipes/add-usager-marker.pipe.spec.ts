import { AddUsagerMarker } from './add-usager-marker.pipe';
import type { MarkerProperties } from '../models';
import type { FeatureCollection, Point } from 'geojson';
import { Coordinates } from '../../../core';
import { AvailableMarkers } from '../../configuration';

describe('AddUsagerMarker pipe', (): void => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let pipeInstance: AddUsagerMarker;

  beforeEach((): void => {
    pipeInstance = new AddUsagerMarker();
  });

  it('should return an unchanged collection if usager coordinates are null', (): void => {
    const featureCollection: FeatureCollection<Point, MarkerProperties> = {
      features: [],
      type: 'FeatureCollection'
    };

    expect(pipeInstance.transform(featureCollection)).toStrictEqual(featureCollection);
  });

  it('should return the collection with and additional element', (): void => {
    const featureCollection: FeatureCollection<Point, MarkerProperties> = {
      features: [
        {
          geometry: {
            coordinates: [0, 0],
            type: 'Point'
          },
          properties: {
            markerIconConfiguration: AvailableMarkers.Usager
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    expect(pipeInstance.transform(featureCollection, new Coordinates(45, 23)).features).toHaveLength(2);
  });
});
