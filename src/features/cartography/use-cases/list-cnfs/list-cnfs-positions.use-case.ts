import type { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CnfsRepository } from '../../core';

import type { Cnfs } from '../../core';

import type { UseCase } from '@architecture/use-case';

export class ListCnfsPositionUseCase implements UseCase<[], Cnfs[]> {
  public constructor(private readonly cnfsRepository: CnfsRepository) {}

  public execute$(): Observable<Cnfs[]> {
    return this.cnfsRepository.listCnfs$();
  }
}
