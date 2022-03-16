/* eslint-disable no-mixed-operators */

import { Coordinates } from '../../../../core';
import { CnfsDetailsPresentation } from '../cnfs';

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

export const getDistanceFromLocation = (
  locationCoordinated?: Coordinates,
  usagerCoordinates?: Coordinates
): Pick<CnfsDetailsPresentation, 'distanceFromUsager'> =>
  usagerCoordinates == null || locationCoordinated == null
    ? {}
    : {
        distanceFromUsager: `${geographicDistance(locationCoordinated, usagerCoordinates).toFixed(TWO_DIGITS_AFTER_COMMA)} km`
      };
