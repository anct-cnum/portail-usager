import { Coordinates } from '../value-objects';
import { AnyGeoJsonProperty } from '../../../../environments/environment.model';

export class Cnfs {
  public constructor(public readonly position: Coordinates, public readonly properties: AnyGeoJsonProperty) {}
}
