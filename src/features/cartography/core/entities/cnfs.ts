import { Coordinates } from '../value-objects';

export interface CnfsProperties {
  email: string;
  name: string;
}

export interface StructureProperties {
  address: string;
  isLabeledFranceServices: boolean;
  name: string;
  phone: string;
  type: string;
}

export class Cnfs {
  public constructor(
    public readonly position: Coordinates,
    public readonly properties: { cnfs: CnfsProperties; structure: StructureProperties }
  ) {}
}
