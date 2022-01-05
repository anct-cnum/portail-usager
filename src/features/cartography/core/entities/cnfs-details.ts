import { StructureContact } from './structure-contact';

export class CnfsDetails {
  public constructor(
    public readonly cnfsNumber: number,
    public readonly structureName: string,
    public readonly openingHours?: string[],
    public readonly structureAddress?: string,
    public readonly contact?: StructureContact
  ) {}
}
