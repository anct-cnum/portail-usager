import { Coordinates } from '../../../../core';

export interface StructurePresentation {
  address: string;
  distanceFromUsager?: string;
  id: string;
  isLabeledFranceServices?: boolean;
  location?: Coordinates;
  name: string;
}
