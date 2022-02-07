import { StructureContact } from './structure-contact';

export enum CnfsType {
  Default = 'Default',
  Coordinateur = 'Coordinateur',
  ChambreDAgriculture = 'ChambreDAgriculture',
  MonEspaceSante = 'MonEspaceSante'
}

export class CnfsDetails {
  public constructor(
    public readonly cnfsNumber: number,
    public readonly structureName: string,
    public readonly type: CnfsType,
    public readonly openingHours?: string[],
    public readonly structureAddress?: string,
    public readonly contact?: StructureContact
  ) {}
}
