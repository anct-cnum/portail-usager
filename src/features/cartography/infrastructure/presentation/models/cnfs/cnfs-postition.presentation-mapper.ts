import { Coordinates } from '../../../../core';
import { CnfsLocationPresentation } from './cnfs-details.presentation';
import { CnfsLocationTransfer } from '../../../data/models';

export const cnfsPositionTransferToPresentation = (
  cnfsDetails: CnfsLocationTransfer,
  id: string
): CnfsLocationPresentation => ({
  coordinates: Coordinates.fromGeoJsonFeature(cnfsDetails),
  id
});
