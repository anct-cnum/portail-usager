import { Coordinates } from '../../../../core';

export enum DayPresentation {
  Monday = 'Lun.',
  Tuesday = 'Mar.',
  Wednesday = 'Mer.',
  Thursday = 'Jeu.',
  Friday = 'Ven.',
  Saturday = 'Sam.',
  Sunday = 'Dim.'
}

export interface Opening {
  day: DayPresentation;
  hours: string;
}

export interface CnfsPresentation {
  email?: string;
  fullName: string;
  phone?: string;
}

export interface CnfsLocationPresentation {
  coordinates: Coordinates;
  id: string;
}

export interface CnfsDetailsPresentation {
  address?: string;
  coordinates?: Coordinates;
  cnfsList: CnfsPresentation[];
  distanceFromUsager?: string;
  email?: string;
  cnfsTypeNote?: string;
  opening: Opening[];
  phone?: string;
  structureName: string;
  website?: string;
}
