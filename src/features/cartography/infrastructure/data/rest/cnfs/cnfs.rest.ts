import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import type { Cnfs } from '../../../../core';
import { CnfsRepository } from '../../../../core';
import type { CnfsTransfer } from '../../models';
import { cnfsTransferToCore } from '../../models';

@Injectable()
export class CnfsRest extends CnfsRepository {
  // TODO Ajouter un intercepteur qui détecte toutes les routes qui commencent par @ et les remplacent le @ par https://API_DOMAINE, cette url étant stockée dans une configuration (token).
  private readonly _endpointUri: string = 'https://beta.api.conseiller-numerique.gouv.fr/conseillers/geolocalisation';

  public constructor(private readonly httpClient: HttpClient) {
    super();
  }

  public listCnfs$(): Observable<Cnfs[]> {
    return this.httpClient.get<CnfsTransfer>(this._endpointUri).pipe(map(cnfsTransferToCore));
  }
}
