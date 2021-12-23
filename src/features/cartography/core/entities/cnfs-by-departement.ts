import { Coordinates } from '../value-objects';

export interface CnfsByDepartementProperties {
  count: number;
  codeDepartement: string;
  nomDepartement: string;
}

export class CnfsByDepartement {
  public constructor(public readonly position: Coordinates, public readonly properties: CnfsByDepartementProperties) {}
}
