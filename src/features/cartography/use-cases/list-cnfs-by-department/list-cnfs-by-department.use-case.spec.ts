import { firstValueFrom, Observable, of } from 'rxjs';
import { ListCnfsByDepartmentUseCase } from './list-cnfs-by-department.use-case';
import { CnfsRepository, CnfsByDepartment } from '../../core';

const CNFS_BY_DEPARTMENT: CnfsByDepartment[] = [
  {
    position: {
      latitude: 5.348666025399395,
      longitude: 46.099798450280282
    },
    properties: {
      boundingZoom: 10,
      code: '01',
      count: 12,
      department: 'Ain'
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
      department: 'Mayotte'
    }
  }
];

const CNFS_REPOSITORY: CnfsRepository = {
  listCnfsByDepartment$(): Observable<CnfsByDepartment[]> {
    return of(CNFS_BY_DEPARTMENT);
  }
} as CnfsRepository;

describe('list cnfs by department', (): void => {
  it('should get the cnfs grouped by department', async (): Promise<void> => {
    const listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase = new ListCnfsByDepartmentUseCase(CNFS_REPOSITORY);

    const actualCnfsByDepartment: CnfsByDepartment[] = await firstValueFrom(listCnfsByDepartmentUseCase.execute$());

    expect(actualCnfsByDepartment).toStrictEqual(CNFS_BY_DEPARTMENT);
  });
});
