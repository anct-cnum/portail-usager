import { Observable } from 'rxjs';
import { Cnfs, CnfsByRegion, CnfsByDepartement } from '../../core';

export abstract class CnfsRepository {
  public abstract listCnfs$(): Observable<Cnfs[]>;
  public abstract listCnfsByDepartement$(): Observable<CnfsByDepartement[]>;
  public abstract listCnfsByRegion$(): Observable<CnfsByRegion[]>;
}
