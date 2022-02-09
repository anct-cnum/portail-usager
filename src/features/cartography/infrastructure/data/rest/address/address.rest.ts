import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordinates, AddressRepository, AddressFound } from '../../../../core';
import { Api } from '../../../../../../environments';
import { AddressFoundTransfer, addressFoundTransferToCore, CoordinatesTransfer, toFirstCoordinates } from '../../models';
import { map } from 'rxjs/operators';

@Injectable()
export class AddressRest extends AddressRepository {
  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public geocode$(address: string): Observable<Coordinates | null> {
    return this.httpClient
      .get<CoordinatesTransfer>(`${Api.ConseillerNumerique}/geocode/${encodeURIComponent(address)}`)
      .pipe(map(toFirstCoordinates));
  }

  public search$(searchTerm: string): Observable<AddressFound[]> {
    return this.httpClient
      .get<AddressFoundTransfer>(`${Api.AdresseDataGouv}/search/?q=${encodeURIComponent(searchTerm)}&type=&autocomplete=1`)
      .pipe(map(addressFoundTransferToCore));
  }
}
