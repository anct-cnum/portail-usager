import { firstValueFrom, Observable, of } from 'rxjs';
import { CnfsDetailsUseCase } from './cnfs-details.use-case';
import { CnfsDetails, CnfsRepository, CnfsType, Coordinates, StructureContact } from '../../core';

const CNFS_DETAILS: CnfsDetails = new CnfsDetails(
  [
    {
      email: 'christelle.bateau@conseiller-numerique.fr',
      fullName: 'Christelle Bateau',
      phone: '08 86 66 87 72'
    },
    {
      email: 'charles.desmoulins@conseiller-numerique.fr',
      fullName: 'Charles Desmoulins',
      phone: '03 86 55 24 40'
    },
    {
      email: 'amélie.dupont@conseiller-numerique.fr',
      fullName: 'Amélie Dupont',
      phone: '03 44 89 62 14'
    }
  ],
  "Association pour l'accès à la technologie",
  CnfsType.Default,
  new Coordinates(43.955, 6.053333),
  ['9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00'],
  '3 rue des lilas, 13000 Marseille',
  new StructureContact('john.doe@email.com', '0123456789', 'https://www.john-doe.com')
);

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
