import type { Observable } from 'rxjs';
import type { Cnfs } from '../../core';

export abstract class CnfsRepository {
  public abstract listCnfs$(): Observable<Cnfs[]>;
}
