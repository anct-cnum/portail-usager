import { Coordinates } from '../value-objects';

export interface CnfsByRegionProperties {
  boundingZoom: number;
  count: number;
  region: string;
}

export class CnfsByRegion {
  public constructor(public readonly position: Coordinates, public readonly properties: CnfsByRegionProperties) {}
}
