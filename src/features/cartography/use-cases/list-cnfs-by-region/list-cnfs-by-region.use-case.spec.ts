import { firstValueFrom, Observable, of } from 'rxjs';
import { ListCnfsByRegionUseCase } from './list-cnfs-by-region.use-case';
import { CnfsRepository, CnfsByRegion } from '../../core';

const CNFS_BY_REGION: CnfsByRegion[] = [
  {
    position: {
      latitude: 43.955,
      longitude: 6.053333
    },
    properties: {
      count: 2,
      region: "Provence-Alpes-Côte d'Azur"
    }
  },
  {
    position: {
      latitude: 49.966111,
      longitude: 2.775278
    },
    properties: {
      count: 7,
      region: 'Hauts-de-France'
    }
  }
];

const CNFS_REPOSITORY: CnfsRepository = {
  listCnfsByRegion$(): Observable<CnfsByRegion[]> {
    return of(CNFS_BY_REGION);
  }
} as CnfsRepository;

describe('list cnfs by region', (): void => {
  it('should get the cnfs grouped by region', async (): Promise<void> => {
    const listCnfsByRegionUseCase: ListCnfsByRegionUseCase = new ListCnfsByRegionUseCase(CNFS_REPOSITORY);

    const actualCnfsByRegion: CnfsByRegion[] = await firstValueFrom(listCnfsByRegionUseCase.execute$());

    expect(actualCnfsByRegion).toStrictEqual(CNFS_BY_REGION);
  });
});
