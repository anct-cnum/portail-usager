import { StructurePresentation } from './structure.presentation';
import { Coordinates } from '../../../../core';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { getDistanceFromLocation } from '../utils/geographic';

export const toStructurePresentation = (
  cnfsPermanenceProperties: CnfsPermanenceProperties[],
  usagerCoordinates?: Coordinates
): StructurePresentation[] =>
  cnfsPermanenceProperties.map(
    (cnfsPermanenceProperty: CnfsPermanenceProperties): StructurePresentation => ({
      address: cnfsPermanenceProperty.address,
      id: cnfsPermanenceProperty.id,
      isLabeledFranceServices: cnfsPermanenceProperty.isLabeledFranceServices,
      name: cnfsPermanenceProperty.name,
      ...getDistanceFromLocation(cnfsPermanenceProperty.position, usagerCoordinates)
    })
  );
