import { firstValueFrom, Observable, of } from 'rxjs';
import { ListCnfsByDepartementUseCase } from './list-cnfs-by-departement.use-case';
import { CnfsRepository, CnfsByDepartement } from '../../core';

const CNFS_BY_DEPARTEMENT: CnfsByDepartement[] = [
  {
    position: {
      latitude: 5.348666025399395,
      longitude: 46.099798450280282
    },
    properties: {
      boundingZoom: 10,
      code: '01',
      count: 12,
      departement: 'Ain'
    }
  },
  {
    position: {
      latitude: 45.147364453253317,
      longitude: -12.820655090736881
    },
    properties: {
      boundingZoom: 10,
      code: '976',
      count: 27,
      departement: 'Mayotte'
    }
  }
];

const CNFS_REPOSITORY: CnfsRepository = {
  listCnfsByDepartement$(): Observable<CnfsByDepartement[]> {
    return of(CNFS_BY_DEPARTEMENT);
  }
} as CnfsRepository;

describe('list cnfs by departement', (): void => {
  it('should get the cnfs grouped by departement', async (): Promise<void> => {
    const listCnfsByDepartementUseCase: ListCnfsByDepartementUseCase = new ListCnfsByDepartementUseCase(CNFS_REPOSITORY);

    const actualCnfsByDepartement: CnfsByDepartement[] = await firstValueFrom(listCnfsByDepartementUseCase.execute$());

    expect(actualCnfsByDepartement).toStrictEqual(CNFS_BY_DEPARTEMENT);
  });
});
