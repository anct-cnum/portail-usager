import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

interface Opening {
  // eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
  day: 'Lun.' | 'Mar.' | 'Mer.' | 'Jeu.' | 'Ven.' | 'Sam.' | 'Dim.';
  hours: string;
}

interface CnfsDetails {
  address: string;
  cnfsNumber: number;
  email: string;
  opening: Opening[];
  phone: string;
  structureName: string;
  website: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cnfs-details',
  templateUrl: './cnfs-details.component.html'
})
export class CnfsDetailsComponent {
  @Output() public readonly backToList: EventEmitter<void> = new EventEmitter<void>();

  @Input() public cnfsDetails: CnfsDetails = {
    address: 'Place José Moron 3200 RIOM',
    cnfsNumber: 2,
    email: 'email@example.com',
    opening: [
      {
        day: 'Lun.',
        hours: '9h30 - 17h30'
      },
      {
        day: 'Mar.',
        hours: '9h30 - 17h30'
      },
      {
        day: 'Mer.',
        hours: '9h30 - 17h30'
      },
      {
        day: 'Jeu.',
        hours: '9h30 - 17h30'
      },
      {
        day: 'Ven.',
        hours: '9h30 - 17h30'
      },
      {
        day: 'Sam.',
        hours: '9h30 - 12h00'
      }
    ],
    phone: '03 86 55 26 40',
    structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
    website: 'https://www.test.com'
  };

  public trackByOpeningDay(_: number, opening: Opening): string {
    return opening.day;
  }
}
