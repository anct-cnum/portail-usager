import { Coordinates } from '../value-objects';

export interface CnfsPermanence {
  id: string;
  name: string;
  address: string;
  isLabeledFranceServices: boolean;
  openingHours?: string[];
  position?: Coordinates;
}

export class Cnfs {
  public constructor(public readonly position: Coordinates, public readonly properties: CnfsPermanence) {}
}
