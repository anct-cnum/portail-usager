import { StructureContact } from './structure-contact';
import { Coordinates } from '../value-objects';

export enum CnfsType {
  Default = 'Default',
  Coordinateur = 'Coordinateur',
  ChambreDAgriculture = 'ChambreDAgriculture',
  MonEspaceSante = 'MonEspaceSante'
}

export interface CnfsInStructure {
  email?: string;
  fullName: string;
  phone?: string;
}

export class CnfsDetails {
  public constructor(
    public readonly cnfs: CnfsInStructure[],
    public readonly structureName: string,
    public readonly type: CnfsType,
    public readonly position: Coordinates,
    public readonly openingHours?: string[],
    public readonly structureAddress?: string,
    public readonly contact?: StructureContact
  ) {}
}
