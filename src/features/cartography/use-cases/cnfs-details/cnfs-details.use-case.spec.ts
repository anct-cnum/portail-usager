import { firstValueFrom, Observable, of } from 'rxjs';
import { CnfsDetailsUseCase } from './cnfs-details.use-case';
import { CnfsDetails, CnfsRepository, CnfsType, Coordinates, StructureContact } from '../../core';

const CNFS_DETAILS: CnfsDetails = {
  cnfs: [
    {
      email: 'christelle.bateau@conseiller-numerique.fr',
      fullName: 'Christelle Bateau',
      phone: '+33 8 86 66 87 72'
    },
    {
      email: 'charles.desmoulins@conseiller-numerique.fr',
      fullName: 'Charles Desmoulins',
      phone: '+33 3 86 55 24 40'
    },
    {
      email: 'amélie.dupont@conseiller-numerique.fr',
      fullName: 'Amélie Dupont',
      phone: '+33 3 44 89 62 14'
    }
  ],
  contact: new StructureContact('john.doe@email.com', '0123456789', 'https://www.john-doe.com'),
  isLabeledAidantsConnect: false,
  openingHours: ['9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00'],
  position: new Coordinates(43.955, 6.053333),
  structureAddress: '3 rue des lilas, 13000 Marseille',
  structureName: "Association pour l'accès à la technologie",
  type: CnfsType.Default
};

const CNFS_REPOSITORY: CnfsRepository = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cnfsDetails$(_: string): Observable<CnfsDetails> {
    return of(CNFS_DETAILS);
  }
} as CnfsRepository;

describe('cnfs details', (): void => {
  it('should get the cnfs details', async (): Promise<void> => {
    const id: string = '88bc36fb0db191928330b1e6';
    const cnfsDetailsUseCase: CnfsDetailsUseCase = new CnfsDetailsUseCase(CNFS_REPOSITORY);

    const cnfsDetails: CnfsDetails = await firstValueFrom(cnfsDetailsUseCase.execute$(id));

    expect(cnfsDetails).toStrictEqual(CNFS_DETAILS);
  });
});
