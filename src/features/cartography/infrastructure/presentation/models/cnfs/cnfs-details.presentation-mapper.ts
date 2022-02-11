import { CnfsDetails, CnfsType } from '../../../../core';
import { CnfsPresentation, CnfsDetailsPresentation, DayPresentation, Opening } from './cnfs-details.presentation';

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

const tmpStaticCnfsListToRemove = (): CnfsPresentation[] => [
  {
    email: 'christelle.bateau@conseiller-numerique.fr',
    fullName: 'Christelle Bateau',
    phone: '08 86 66 87 72'
  },
  {
    email: 'charles.desmoulins@conseiller-numerique.fr',
    fullName: 'Charles Desmoulins',
    phone: '03 86 55 24 40'
  }
];

export const cnfsDetailsToPresentation = (cnfsDetails: CnfsDetails): CnfsDetailsPresentation => ({
  address: cnfsDetails.structureAddress,
  cnfsList: tmpStaticCnfsListToRemove(),
  email: cnfsDetails.contact?.email,
  ...getCnfsTypeNote(cnfsDetails.type),
  opening: openingHoursToPresentation(cnfsDetails.openingHours),
  phone: cnfsDetails.contact?.phone,
  structureName: cnfsDetails.structureName,
  website: cnfsDetails.contact?.website
});
