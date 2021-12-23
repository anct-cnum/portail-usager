import { Observable } from 'rxjs';
import { Cnfs, CnfsRepository } from '../../core';
import { UseCase } from '@architecture/use-case';

export class ListCnfsUseCase implements UseCase<[], Cnfs[]> {
  public constructor(private readonly cnfsRepository: CnfsRepository) {}

  public execute$(): Observable<Cnfs[]> {
    return this.cnfsRepository.listCnfs$();
  }
}
