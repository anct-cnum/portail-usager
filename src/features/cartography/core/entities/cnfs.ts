import { Coordinates } from '../value-objects';
import { CnfsProperties, StructureProperties } from '../../../../environments/environment.model';

export class Cnfs {
  public constructor(
    public readonly position: Coordinates,
    public readonly properties: { cnfs: CnfsProperties; structure: StructureProperties }
  ) {}
}
