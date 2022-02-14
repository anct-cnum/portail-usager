export enum CnfsTypeTransfer {
  Default = 'Default',
  Coordinateur = 'Coordinateur',
  ChambreDAgriculture = 'ChambreDAgriculture',
  MonEspaceSante = 'MonEspaceSante'
}

export interface CnfsInStructureTransfer {
  email?: string;
  nom: string;
  phone?: string;
  prenom: string;
}

export interface CnfsDetailsTransfer {
  adresse: string;
  cnfs: CnfsInStructureTransfer[];
  email: string;
  nom: string;
  telephone: string;
  nombreCnfs: number;
  type?: CnfsTypeTransfer;
}
