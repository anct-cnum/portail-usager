import { Observable } from 'rxjs';
import { Cnfs, CnfsByRegion, CnfsByDepartment } from '../../core';

export abstract class CnfsRepository {
  public abstract listCnfs$(): Observable<Cnfs[]>;
  public abstract listCnfsByDepartment$(): Observable<CnfsByDepartment[]>;
  public abstract listCnfsByRegion$(): Observable<CnfsByRegion[]>;
}
