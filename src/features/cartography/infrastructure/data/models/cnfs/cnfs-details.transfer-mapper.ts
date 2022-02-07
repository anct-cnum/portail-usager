import { CnfsDetails, CnfsType, StructureContact } from '../../../../core';
import { CnfsDetailsTransfer, CnfsTypeTransfer } from './cnfs-details.transfer';

const CNFS_TYPE_MAP: Map<CnfsTypeTransfer | undefined, CnfsType> = new Map([
  [CnfsTypeTransfer.Coordinateur, CnfsType.Coordinateur],
  [CnfsTypeTransfer.ChambreDAgriculture, CnfsType.ChambreDAgriculture],
  [CnfsTypeTransfer.Default, CnfsType.Default],
  [CnfsTypeTransfer.MonEspaceSante, CnfsType.MonEspaceSante]
]);

const getCnfsType = (type: CnfsTypeTransfer | undefined): CnfsType => CNFS_TYPE_MAP.get(type) ?? CnfsType.Default;

export const cnfsDetailsTransferToCore = (cnfsDetailsTransfer: CnfsDetailsTransfer): CnfsDetails =>
  new CnfsDetails(
    cnfsDetailsTransfer.nombreCnfs,
    cnfsDetailsTransfer.nom,
    getCnfsType(cnfsDetailsTransfer.type),
    [],
    cnfsDetailsTransfer.adresse,
    new StructureContact(cnfsDetailsTransfer.email, cnfsDetailsTransfer.telephone)
  );
