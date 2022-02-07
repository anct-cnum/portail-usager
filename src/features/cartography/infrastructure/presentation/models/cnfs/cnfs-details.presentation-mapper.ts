import { CnfsDetails, CnfsType } from '../../../../core';
import { CnfsDetailsPresentation, DayPresentation, Opening } from './cnfs-details.presentation';

const OPENING_DAYS: DayPresentation[] = Object.values(DayPresentation);

const STRUCTURE_NOTE_MAP: Map<CnfsType, string> = new Map<CnfsType, string>([
  [CnfsType.ChambreDAgriculture, "Un conseiller de cette structure est spécialisé dans l'accueil des professions agricoles"]
]);

const openingHoursToPresentation = (openingHours: string[] = []): Opening[] =>
  openingHours.map(
    (openingHour: string, index: number): Opening => ({
      day: OPENING_DAYS[index],
      hours: openingHour
    })
  );

const getNote = (type: CnfsType): Pick<CnfsDetailsPresentation, 'note'> =>
  STRUCTURE_NOTE_MAP.has(type)
    ? {
        note: STRUCTURE_NOTE_MAP.get(type)
      }
    : {};

export const cnfsDetailsToPresentation = (cnfsDetails: CnfsDetails): CnfsDetailsPresentation => ({
  address: cnfsDetails.structureAddress,
  cnfsNumber: cnfsDetails.cnfsNumber,
  email: cnfsDetails.contact?.email,
  ...getNote(cnfsDetails.type),
  opening: openingHoursToPresentation(cnfsDetails.openingHours),
  phone: cnfsDetails.contact?.phone,
  structureName: cnfsDetails.structureName,
  website: cnfsDetails.contact?.website
});
