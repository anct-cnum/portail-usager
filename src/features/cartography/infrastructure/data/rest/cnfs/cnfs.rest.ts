import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Cnfs, CnfsByDepartment, CnfsByRegion, CnfsDetails, CnfsRepository } from '../../../../core';
import {
  CnfsByDepartmentTransfer,
  cnfsByDepartmentTransferToCore,
  CnfsByRegionTransfer,
  cnfsByRegionTransferToCore,
  CnfsDetailsTransfer,
  cnfsDetailsTransferToCore,
  CnfsTransfer,
  cnfsTransferToCore
} from '../../models';
import { Api } from '../../../../../../environments/environment.model';

@Injectable()
export class CnfsRest extends CnfsRepository {
  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public cnfsDetails$(id: string): Observable<CnfsDetails> {
    return this.httpClient
      .get<CnfsDetailsTransfer>(`${Api.ConseillerNumerique}/conseillers/permanence/${id}`)
      .pipe(map(cnfsDetailsTransferToCore));
  }

  public listCnfs$(): Observable<Cnfs[]> {
    return this.httpClient
      .get<CnfsTransfer>(`${Api.ConseillerNumerique}/conseillers/geolocalisation`)
      .pipe(map(cnfsTransferToCore));
  }

  public listCnfsByDepartment$(): Observable<CnfsByDepartment[]> {
    return this.httpClient
      .get<CnfsByDepartmentTransfer>(`${Api.ConseillerNumerique}/conseillers/geolocalisation/par-departement`)
      .pipe(map(cnfsByDepartmentTransferToCore));
  }

  public listCnfsByRegion$(): Observable<CnfsByRegion[]> {
    return this.httpClient
      .get<CnfsByRegionTransfer>(`${Api.ConseillerNumerique}/conseillers/geolocalisation/par-region`)
      .pipe(map(cnfsByRegionTransferToCore));
  }
}
