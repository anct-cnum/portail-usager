import { Coordinates } from '../../../../core';
import { DayPresentation } from '../cnfs';

export interface StructureOpeningPresentation {
  isOpen: boolean;
  nextOpeningDay?: DayPresentation;
}

export type StructurePresentation = StructureOpeningPresentation & {
  address: string;
  distanceFromUsager?: string;
  id: string;
  isLabeledFranceServices?: boolean;
  location?: Coordinates;
  name: string;
};
