import { CnfsDetails, CnfsInStructure, CnfsType, Coordinates } from '../../../../core';
import { CnfsPresentation, CnfsDetailsPresentation, DayPresentation, Opening } from './cnfs-details.presentation';
import { getUsagerDistanceFromLocation } from '../utils/geographic';

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

const getCnfsTypeNote = (type: CnfsType): Pick<CnfsDetailsPresentation, 'cnfsTypeNote'> =>
  STRUCTURE_NOTE_MAP.has(type)
    ? {
        cnfsTypeNote: STRUCTURE_NOTE_MAP.get(type)
      }
    : {};

const toCnfsPresentation = (cnfsInStructure: CnfsInStructure): CnfsPresentation => cnfsInStructure;

export const cnfsDetailsToPresentation = (
  cnfsDetails: CnfsDetails,
  usagerCoordinates?: Coordinates
): CnfsDetailsPresentation => ({
  address: cnfsDetails.structureAddress,
  cnfsList: cnfsDetails.cnfs.map(toCnfsPresentation),
  coordinates: cnfsDetails.position,
  ...getUsagerDistanceFromLocation(cnfsDetails.position, usagerCoordinates),
  email: cnfsDetails.contact?.email,
  ...getCnfsTypeNote(cnfsDetails.type),
  opening: openingHoursToPresentation(cnfsDetails.openingHours),
  phone: cnfsDetails.contact?.phone,
  structureName: cnfsDetails.structureName,
  website: cnfsDetails.contact?.website
});
