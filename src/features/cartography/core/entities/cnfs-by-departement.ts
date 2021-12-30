import { Coordinates } from '../value-objects';

export interface CnfsByDepartementProperties {
  boundingZoom: number;
  count: number;
  code: string;
  departement: string;
}

export class CnfsByDepartement {
  public constructor(public readonly position: Coordinates, public readonly properties: CnfsByDepartementProperties) {}
}
