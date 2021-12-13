import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Cnfs, CnfsByRegion, CnfsRepository } from '../../../../core';
import {CnfsByRegionTransfer, cnfsByRegionTransferToCore, CnfsTransfer, cnfsTransferToCore} from '../../models';
import { Api } from '../../../../../../environments/environment.model';

@Injectable()
export class CnfsRest extends CnfsRepository {
  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public listCnfs$(): Observable<Cnfs[]> {
    return this.httpClient
      .get<CnfsTransfer>(`${Api.ConseillerNumerique}/conseillers/geolocalisation`)
      .pipe(map(cnfsTransferToCore));
  }

  public listCnfsByRegion$(): Observable<CnfsByRegion[]> {
    return this.httpClient
      .get<CnfsByRegionTransfer>(`${Api.ConseillerNumerique}/conseillers/geolocalisation/par-region`)
      .pipe(map(cnfsByRegionTransferToCore));
  }
}
