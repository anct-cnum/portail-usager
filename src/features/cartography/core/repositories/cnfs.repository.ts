import { Observable } from 'rxjs';
import { Cnfs, CnfsByRegion, CnfsByDepartment, CnfsDetails } from '../../core';

export abstract class CnfsRepository {
  public abstract cnfsDetails$(id: string): Observable<CnfsDetails>;
  public abstract listCnfs$(): Observable<Cnfs[]>;
  public abstract listCnfsByDepartment$(): Observable<CnfsByDepartment[]>;
  public abstract listCnfsByRegion$(): Observable<CnfsByRegion[]>;
}
