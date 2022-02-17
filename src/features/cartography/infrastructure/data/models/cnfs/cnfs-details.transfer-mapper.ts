import { CnfsDetails, CnfsInStructure, CnfsType, Coordinates, StructureContact } from '../../../../core';
import { CnfsDetailsTransfer, CnfsInStructureTransfer, CnfsTypeTransfer } from './cnfs-details.transfer';
import { Position } from 'geojson';

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

const getPosition = (position?: Position): Pick<CnfsDetails, 'position'> =>
  position == null
    ? {}
    : {
        position: new Coordinates(position[1], position[0])
      };

export const cnfsDetailsTransferToCore = (cnfsDetailsTransfer: CnfsDetailsTransfer): CnfsDetails => ({
  cnfs: cnfsDetailsTransfer.cnfs.map(toCnfsCore),
  contact: new StructureContact(cnfsDetailsTransfer.email, cnfsDetailsTransfer.telephone),
  openingHours: [],
  ...getPosition(cnfsDetailsTransfer.coordinates),
  structureAddress: cnfsDetailsTransfer.adresse,
  structureName: cnfsDetailsTransfer.nom,
  type: getCnfsType(cnfsDetailsTransfer.type)
});
