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

export interface CnfsDetailsPresentation {
  address?: string;
  cnfsNumber: number;
  email?: string;
  cnfsTypeNote?: string;
  opening: Opening[];
  phone?: string;
  structureName: string;
  website?: string;
}
