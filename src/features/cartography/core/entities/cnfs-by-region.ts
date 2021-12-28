import { Coordinates } from '../value-objects';
import { CnfsByRegionProperties } from '../../../../environments/environment.model';

export class CnfsByRegion {
  public constructor(public readonly position: Coordinates, public readonly properties: CnfsByRegionProperties) {}
}
