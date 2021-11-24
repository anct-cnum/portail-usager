import type { Cnfs } from '../../core';
import { CnfsRepository } from '../../core';
import type { Observable } from 'rxjs';
import type { CnfsTransfer } from '../../infrastructure/data/models';
import { cnfsTransferToCore } from '../../infrastructure/data/models';
import { of } from 'rxjs';
import { cnfsDataCluster } from './data/cnfs-data-cluster';

export class CnfsRestTestDouble extends CnfsRepository {
  public listCnfs$(): Observable<Cnfs[]> {
    const cnfsGeoJson: CnfsTransfer = cnfsDataCluster() as CnfsTransfer;
    return of(cnfsTransferToCore(cnfsGeoJson));
  }
}
