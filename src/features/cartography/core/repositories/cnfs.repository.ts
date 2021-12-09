import { Observable } from 'rxjs';
import { Cnfs } from '../../core';

export abstract class CnfsRepository {
  public abstract listCnfs$(): Observable<Cnfs[]>;
}
