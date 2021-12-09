import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Cnfs, CnfsRepository } from '../../../../core';
import { CnfsTransfer, cnfsTransferToCore } from '../../models';
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
