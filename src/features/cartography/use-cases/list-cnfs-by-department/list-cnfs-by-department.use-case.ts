import { UseCase } from '../../../../utils/architecture';
import { Observable } from 'rxjs';
import { CnfsRepository, CnfsByDepartment } from '../../core';

export class ListCnfsByDepartmentUseCase implements UseCase<[], CnfsByDepartment[]> {
  public constructor(private readonly cnfsRepository: CnfsRepository) {}

  public execute$(): Observable<CnfsByDepartment[]> {
    return this.cnfsRepository.listCnfsByDepartment$();
  }
}
