import { CnfsDetails, StructureContact } from '../../../core';
import { CnfsDetailsTransfer } from './cnfs-details.transfer';

export const cnfsDetailsTransferToCore = (cnfsDetailsTransfer: CnfsDetailsTransfer): CnfsDetails =>
  new CnfsDetails(
    cnfsDetailsTransfer.nombreCnfs,
    cnfsDetailsTransfer.nom,
    [],
    cnfsDetailsTransfer.adresse,
    new StructureContact(cnfsDetailsTransfer.email, cnfsDetailsTransfer.telephone)
  );
