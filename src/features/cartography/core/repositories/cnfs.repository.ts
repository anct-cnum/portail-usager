import { Observable } from 'rxjs';
import { Cnfs, CnfsByRegion } from '../../core';

export abstract class CnfsRepository {
  public abstract listCnfs$(): Observable<Cnfs[]>;
  public abstract listCnfsByRegion$(): Observable<CnfsByRegion[]>;
}
