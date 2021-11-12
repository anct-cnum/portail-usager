import { InvalidLatitudeError, InvalidLongitudeError } from './errors';

const MIN_LATITUDE: number = -90;
const MAX_LATITUDE: number = 90;
const MIN_LONGITUDE: number = -180;
const MAX_LONGITUDE: number = 180;

const isValidLatitudeAngle = (latitudeInDegree: number): boolean =>
  latitudeInDegree >= MIN_LATITUDE && latitudeInDegree <= MAX_LATITUDE;
const isValidLongitudeAngle = (longitudeInDegree: number): boolean =>
  longitudeInDegree >= MIN_LONGITUDE && longitudeInDegree <= MAX_LONGITUDE;

export class Coordinates {
  public constructor(public readonly latitude: number, public readonly longitude: number) {
    if (!isValidLatitudeAngle(latitude)) throw new InvalidLatitudeError(latitude);
    if (!isValidLongitudeAngle(longitude)) throw new InvalidLongitudeError(longitude);
  }
}
