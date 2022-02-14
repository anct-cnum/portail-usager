import { CnfsDetails, CnfsInStructure, CnfsType, StructureContact } from '../../../../core';
import { CnfsDetailsTransfer, CnfsInStructureTransfer, CnfsTypeTransfer } from './cnfs-details.transfer';

const CNFS_TYPE_MAP: Map<CnfsTypeTransfer | undefined, CnfsType> = new Map([
  [CnfsTypeTransfer.Coordinateur, CnfsType.Coordinateur],
  [CnfsTypeTransfer.ChambreDAgriculture, CnfsType.ChambreDAgriculture],
  [CnfsTypeTransfer.Default, CnfsType.Default],
  [CnfsTypeTransfer.MonEspaceSante, CnfsType.MonEspaceSante]
]);

const getCnfsType = (type: CnfsTypeTransfer | undefined): CnfsType => CNFS_TYPE_MAP.get(type) ?? CnfsType.Default;

const toCnfsCore = (cnfs: CnfsInStructureTransfer): CnfsInStructure => ({
  email: cnfs.email,
  fullName: `${cnfs.prenom} ${cnfs.nom}`,
  phone: cnfs.phone
});

export const cnfsDetailsTransferToCore = (cnfsDetailsTransfer: CnfsDetailsTransfer): CnfsDetails =>
  new CnfsDetails(
    cnfsDetailsTransfer.cnfs.map(toCnfsCore),
    cnfsDetailsTransfer.nom,
    getCnfsType(cnfsDetailsTransfer.type),
    [],
    cnfsDetailsTransfer.adresse,
    new StructureContact(cnfsDetailsTransfer.email, cnfsDetailsTransfer.telephone)
  );
