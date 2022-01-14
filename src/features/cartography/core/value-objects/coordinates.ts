import { InvalidLatitudeError, InvalidLongitudeError } from './errors';
import { Feature, Point } from 'geojson';

const MIN_LATITUDE: number = -90;
const MAX_LATITUDE: number = 90;
const MIN_LONGITUDE: number = -180;
const MAX_LONGITUDE: number = 180;

export class Coordinates {
  public constructor(public readonly latitude: number, public readonly longitude: number) {
    if (!Coordinates.isValidLatitudeAngle(latitude)) throw new InvalidLatitudeError(latitude);
    if (!Coordinates.isValidLongitudeAngle(longitude)) throw new InvalidLongitudeError(longitude);
  }

  public static fromGeoJsonFeature<T>(feature: Feature<Point, T>): Coordinates {
    return new Coordinates(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
  }

  public static isValidLatitudeAngle(latitudeInDegree: number): boolean {
    return latitudeInDegree >= MIN_LATITUDE && latitudeInDegree <= MAX_LATITUDE;
  }

  public static isValidLongitudeAngle(longitudeInDegree: number): boolean {
    return longitudeInDegree >= MIN_LONGITUDE && longitudeInDegree <= MAX_LONGITUDE;
  }
}
