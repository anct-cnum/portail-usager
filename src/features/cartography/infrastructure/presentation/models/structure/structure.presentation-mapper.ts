import { StructurePresentation } from './structure.presentation';
import { Coordinates } from '../../../../core';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { getUsagerDistanceFromLocation } from '../utils/geographic';
import { formatOpeningHours, getStructureOpening } from './structure-opening.helper';

export const toStructurePresentation = (
  cnfsPermanenceProperties: CnfsPermanenceProperties[],
  date: Date,
  usagerCoordinates?: Coordinates
): StructurePresentation[] =>
  cnfsPermanenceProperties.map(
    (cnfsPermanenceProperty: CnfsPermanenceProperties): StructurePresentation => ({
      address: cnfsPermanenceProperty.address,
      id: cnfsPermanenceProperty.id,
      isLabeledAidantsConnect: cnfsPermanenceProperty.isLabeledAidantsConnect,
      isLabeledFranceServices: cnfsPermanenceProperty.isLabeledFranceServices,
      name: cnfsPermanenceProperty.name,
      ...getUsagerDistanceFromLocation(cnfsPermanenceProperty.position, usagerCoordinates),
      ...getStructureOpening(date, formatOpeningHours(cnfsPermanenceProperty.openingHours))
    })
  );
