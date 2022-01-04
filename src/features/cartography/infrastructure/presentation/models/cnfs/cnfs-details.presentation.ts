export interface Opening {
  // eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
  day: 'Lun.' | 'Mar.' | 'Mer.' | 'Jeu.' | 'Ven.' | 'Sam.' | 'Dim.';
  hours: string;
}

export interface CnfsDetailsPresentation {
  address: string;
  cnfsNumber: number;
  email?: string;
  opening: Opening[];
  phone?: string;
  structureName: string;
  website?: string;
}
