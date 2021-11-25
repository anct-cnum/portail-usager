import type { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import type { Cnfs } from '../../../../core';
import { CnfsRepository } from '../../../../core';
import type { CnfsTransfer } from '../../models';
import { cnfsTransferToCore } from '../../models';
import { Api } from '../../../../../../environments/environment.model';

@Injectable()
export class CnfsRest extends CnfsRepository {
  private readonly _cnsfEndpoint: string = 'conseillers/geolocalisation';

  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public listCnfs$(): Observable<Cnfs[]> {
    return this.httpClient.get<CnfsTransfer>(`${Api.ConseillerNumerique}/${this._cnsfEndpoint}`).pipe(map(cnfsTransferToCore));
  }
}
