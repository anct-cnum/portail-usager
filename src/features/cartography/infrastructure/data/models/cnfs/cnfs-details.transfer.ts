export enum CnfsTypeTransfer {
  Default = 'Default',
  Coordinateur = 'Coordinateur',
  ChambreDAgriculture = 'ChambreDAgriculture',
  MonEspaceSante = 'MonEspaceSante'
}

export interface CnfsDetailsTransfer {
  adresse: string;
  email: string;
  nom: string;
  telephone: string;
  nombreCnfs: number;
  type?: CnfsTypeTransfer;
}
