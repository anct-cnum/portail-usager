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

export interface CnfsDetails {
  access?: string;
  cnfs: CnfsInStructure[];
  contact?: StructureContact;
  openingHours?: string[];
  position?: Coordinates;
  structureAddress?: string;
  structureName: string;
  type: CnfsType;
}
