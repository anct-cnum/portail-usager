import type { Cnfs } from '../../core';
import { CnfsRepository } from '../../core';
import type { Observable } from 'rxjs';
import type { CnfsTransfer } from '../../infrastructure/data/models';
import { cnfsTransferToCore } from '../../infrastructure/data/models';
import { of } from 'rxjs';
import { cnfsData } from './data/cnfs-data';

export class CnfsRestTestDouble extends CnfsRepository {
  public listCnfs$(): Observable<Cnfs[]> {
    const cnfsGeoJson: CnfsTransfer = cnfsData() as CnfsTransfer;
    return of(cnfsTransferToCore(cnfsGeoJson));
  }
}
