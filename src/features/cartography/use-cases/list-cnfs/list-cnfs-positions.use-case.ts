import type { Observable } from 'rxjs';
import type { Cnfs, CnfsRepository } from '../../core';
import type { UseCase } from '@architecture/use-case';

export class ListCnfsPositionUseCase implements UseCase<[], Cnfs[]> {
  public constructor(private readonly cnfsRepository: CnfsRepository) {}

  public execute$(): Observable<Cnfs[]> {
    return this.cnfsRepository.listCnfs$();
  }
}
