/* eslint-disable no-mixed-operators */

import { CnfsDetails, CnfsInStructure, CnfsType, Coordinates } from '../../../../core';
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

const toCnfsPresentation = (cnfsInStructure: CnfsInStructure): CnfsPresentation => cnfsInStructure;

const HALF_CIRCLE_DEGREE: number = 180;

const DEGREE_TO_RADIANS_FACTOR: number = Math.PI / HALF_CIRCLE_DEGREE;

const EARTH_DIAMETER_KM: number = 12_742;

const HALF: number = 0.5;

/**
 * https://en.wikipedia.org/wiki/Haversine_formula (optimized with cos)
 */
const usingHaversineFormula = (
  latitudeARadian: number,
  latitudeBRadian: number,
  deltaLatitudeRadian: number,
  deltaLongitudeRadian: number
): number =>
  EARTH_DIAMETER_KM *
  Math.asin(
    Math.sqrt(
      HALF *
        (1 -
          Math.cos(deltaLatitudeRadian) +
          Math.cos(latitudeARadian) * Math.cos(latitudeBRadian) * (1 - Math.cos(deltaLongitudeRadian)))
    )
  );

const geographicDistance = (coordinatesA: Coordinates, coordinatesB: Coordinates): number => {
  const latitudeARadian: number = coordinatesA.latitude * DEGREE_TO_RADIANS_FACTOR;
  const latitudeBRadian: number = coordinatesB.latitude * DEGREE_TO_RADIANS_FACTOR;
  const deltaLatitudeRadian: number = latitudeBRadian - latitudeARadian;
  const deltaLongitudeRadian: number = (coordinatesB.longitude - coordinatesA.longitude) * DEGREE_TO_RADIANS_FACTOR;

  return usingHaversineFormula(latitudeARadian, latitudeBRadian, deltaLatitudeRadian, deltaLongitudeRadian);
};

const TWO_DIGITS_AFTER_COMMA: number = 2;

const getDistanceFromUsager = (
  cnfsPosition?: Coordinates,
  usagerCoordinates?: Coordinates
): Pick<CnfsDetailsPresentation, 'distanceFromUsager'> =>
  usagerCoordinates == null || cnfsPosition == null
    ? {}
    : {
        distanceFromUsager: `${geographicDistance(cnfsPosition, usagerCoordinates).toFixed(TWO_DIGITS_AFTER_COMMA)} km`
      };

export const cnfsDetailsToPresentation = (
  cnfsDetails: CnfsDetails,
  usagerCoordinates?: Coordinates
): CnfsDetailsPresentation => ({
  address: cnfsDetails.structureAddress,
  cnfsList: cnfsDetails.cnfs.map(toCnfsPresentation),
  coordinates: cnfsDetails.position,
  ...getDistanceFromUsager(cnfsDetails.position, usagerCoordinates),
  email: cnfsDetails.contact?.email,
  ...getCnfsTypeNote(cnfsDetails.type),
  opening: openingHoursToPresentation(cnfsDetails.openingHours),
  phone: cnfsDetails.contact?.phone,
  structureName: cnfsDetails.structureName,
  website: cnfsDetails.contact?.website
});
