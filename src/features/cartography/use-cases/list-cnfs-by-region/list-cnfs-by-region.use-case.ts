import { UseCase } from '../../../../utils/architecture';
import { Observable } from 'rxjs';
import { CnfsRepository, CnfsByRegion } from '../../core';

export class ListCnfsByRegionUseCase implements UseCase<[], CnfsByRegion[]> {
  public constructor(private readonly cnfsRepository: CnfsRepository) {}

  public execute$(): Observable<CnfsByRegion[]> {
    return this.cnfsRepository.listCnfsByRegion$();
  }
}
