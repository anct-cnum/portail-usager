import { UseCase } from '../../../../utils/architecture';
import { Observable } from 'rxjs';
import { CnfsRepository, CnfsDetails } from '../../core';

export class CnfsDetailsUseCase implements UseCase<[string], CnfsDetails> {
  public constructor(private readonly cnfsRepository: CnfsRepository) {}

  public execute$(id: string): Observable<CnfsDetails> {
    return this.cnfsRepository.cnfsDetails$(id);
  }
}
