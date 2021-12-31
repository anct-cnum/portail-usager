import { Coordinates } from '../value-objects';

export interface CnfsByDepartmentProperties {
  boundingZoom: number;
  count: number;
  code: string;
  department: string;
}

export class CnfsByDepartment {
  public constructor(public readonly position: Coordinates, public readonly properties: CnfsByDepartmentProperties) {}
}
