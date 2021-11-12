import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import type { Cnfs } from '../../../../core';
import { CnfsRepository } from '../../../../core';
import type { CnfsTransfer } from '../../models';
import { cnfsTransferToCore } from '../../models';
import { CartographyFeatureModule } from '../../../configuration';

@Injectable({
  providedIn: CartographyFeatureModule
})
export class CnfsRest extends CnfsRepository {
  // Ajouter un intercepteur qui détecte toutes les routes qui commencent par $ et les remplacent le $ par https://MON_API_DOMAINE/api/, cette url étant stockée dans une configuration (token).
  private readonly _endpointUri: string = 'https://MON_API_DOMAINE/api/LIST_CNFS';

  public constructor(private readonly httpClient: HttpClient) {
    super();
  }

  public listCnfs$(): Observable<Cnfs[]> {
    return this.httpClient.get<CnfsTransfer>(this._endpointUri).pipe(map(cnfsTransferToCore));
  }
}
