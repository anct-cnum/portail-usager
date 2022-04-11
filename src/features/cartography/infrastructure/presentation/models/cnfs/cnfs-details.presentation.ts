import { Coordinates } from '../../../../core';

export enum DayPresentation {
  Monday = 'Lundi',
  Tuesday = 'Mardi',
  Wednesday = 'Mercredi',
  Thursday = 'Jeudi',
  Friday = 'Vendredi',
  Saturday = 'Samedi',
  Sunday = 'Dimanche'
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
  access?: string;
  coordinates?: Coordinates;
  cnfsList: CnfsPresentation[];
  distanceFromUsager?: string;
  isLabeledAidantsConnect: boolean;
  email?: string;
  cnfsTypeNote?: string;
  opening: Opening[];
  phone?: string;
  structureName: string;
  website?: string;
}
