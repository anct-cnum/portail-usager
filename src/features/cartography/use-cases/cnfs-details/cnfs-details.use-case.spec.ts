import { firstValueFrom, Observable, of } from 'rxjs';
import { CnfsDetailsUseCase } from './cnfs-details.use-case';
import { CnfsDetails, CnfsRepository, StructureContact } from '../../core';

const CNFS_DETAILS: CnfsDetails = new CnfsDetails(
  3,
  "Association pour l'accès à la technologie",
  ['9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00', '9h00 - 18h00'],
  '3 rue des lilas, 13000 Marseille',
  new StructureContact('john.doe@email.com', '0123456789', 'https://www.john-doe.com')
);

const CNFS_REPOSITORY: CnfsRepository = {
  cnfsDetails$(): Observable<CnfsDetails> {
    return of(CNFS_DETAILS);
  }
} as CnfsRepository;

describe('cnfs details', (): void => {
  it('should get the cnfs details', async (): Promise<void> => {
    const cnfsDetailsUseCase: CnfsDetailsUseCase = new CnfsDetailsUseCase(CNFS_REPOSITORY);

    const cnfsDetails: CnfsDetails = await firstValueFrom(cnfsDetailsUseCase.execute$());

    expect(cnfsDetails).toStrictEqual(CNFS_DETAILS);
  });
});
