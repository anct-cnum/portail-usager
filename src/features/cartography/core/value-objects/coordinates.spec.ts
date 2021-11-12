import { InvalidLatitudeError, InvalidLongitudeError } from './errors';
import { Coordinates } from './coordinates';

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
});
