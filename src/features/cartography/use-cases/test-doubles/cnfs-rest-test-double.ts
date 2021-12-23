import { Cnfs, CnfsByDepartment, CnfsByRegion, CnfsRepository } from '../../core';
import { Observable, of } from 'rxjs';
import { CnfsTransfer, cnfsTransferToCore } from '../../infrastructure/data/models';
import { cnfsDataCluster } from './data/cnfs-data-cluster';

export class CnfsRestTestDouble extends CnfsRepository {
  public listCnfs$(): Observable<Cnfs[]> {
    const cnfsGeoJson: CnfsTransfer = cnfsDataCluster() as CnfsTransfer;
    return of(cnfsTransferToCore(cnfsGeoJson));
  }

  public listCnfsByDepartment$(): Observable<CnfsByDepartment[]> {
    return of([]);
  }

  public listCnfsByRegion$(): Observable<CnfsByRegion[]> {
    return of([]);
  }
}
