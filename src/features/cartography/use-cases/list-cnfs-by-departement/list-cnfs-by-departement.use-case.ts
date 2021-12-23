import { UseCase } from '../../../../utils/architecture';
import { Observable } from 'rxjs';
import { CnfsRepository, CnfsByDepartement } from '../../core';

export class ListCnfsByDepartementUseCase implements UseCase<[], CnfsByDepartement[]> {
  public constructor(private readonly cnfsRepository: CnfsRepository) {}

  public execute$(): Observable<CnfsByDepartement[]> {
    return this.cnfsRepository.listCnfsByDepartement$();
  }
}
