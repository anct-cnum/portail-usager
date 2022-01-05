import { CnfsDetails } from '../../../../core';
import { CnfsDetailsPresentation, DayPresentation, Opening } from './cnfs-details.presentation';

const OPENING_DAYS: DayPresentation[] = Object.values(DayPresentation);

const openingHoursToPresentation = (openingHours: string[] = []): Opening[] =>
  openingHours.map(
    (openingHour: string, index: number): Opening => ({
      day: OPENING_DAYS[index],
      hours: openingHour
    })
  );

export const cnfsDetailsToPresentation = (cnfsDetails: CnfsDetails): CnfsDetailsPresentation => ({
  address: cnfsDetails.structureAddress,
  cnfsNumber: cnfsDetails.cnfsNumber,
  email: cnfsDetails.contact?.email,
  opening: openingHoursToPresentation(cnfsDetails.openingHours),
  phone: cnfsDetails.contact?.phone,
  structureName: cnfsDetails.structureName,
  website: cnfsDetails.contact?.website
});
