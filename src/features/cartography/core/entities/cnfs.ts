import type { Coordinates } from '../value-objects';
import type { GeoJsonProperties } from 'geojson';

export class Cnfs {
  public constructor(public readonly position: Coordinates, public readonly properties: GeoJsonProperties) {}
}
