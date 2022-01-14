import { InvalidLatitudeError, InvalidLongitudeError } from './errors';
import { Coordinates } from './coordinates';
import { Feature, Point } from 'geojson';

describe('Coordinates value object', (): void => {
  it('should throw an InvalidLatitudeError if -90 < latitude <= 90', (): void => {
    const invalidLatitude: number = -91;
    expect((): Coordinates => new Coordinates(invalidLatitude, 54)).toThrow(new InvalidLatitudeError(invalidLatitude));
  });

  it('should throw an InvalidLatitudeError if -90 < longitude <= 90', (): void => {
    const invalidLongitude: number = 181;
    expect((): Coordinates => new Coordinates(-56, 181)).toThrow(new InvalidLongitudeError(invalidLongitude));
  });

  it('should be a valid instance of Coordinates if both values are valid', (): void => {
    const coordinates: Coordinates = new Coordinates(56, 62);
    expect(coordinates).toBeInstanceOf(Coordinates);
  });

  it('should create coordinates from geojson feature', (): void => {
    const feature: Feature<Point, null> = {
      geometry: {
        coordinates: [62, 56],
        type: 'Point'
      },
      properties: null,
      type: 'Feature'
    };

    const coordinates: Coordinates = Coordinates.fromGeoJsonFeature(feature);

    expect(coordinates).toStrictEqual(new Coordinates(56, 62));
  });
});
