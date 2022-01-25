import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordinates, AddressRepository, AddressFound } from '../../../../core';
import { Api } from '../../../../../../environments/environment.model';
import {
  AddressFoundTransfer,
  addressFoundTransferToCore,
  CoordinatesTransfer,
  coordinatesTransferToFirstCoordinates
} from '../../models';
import { map } from 'rxjs/operators';

@Injectable()
export class AddressRest extends AddressRepository {
  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public geocode$(address: string): Observable<Coordinates> {
    return this.httpClient
      .get<CoordinatesTransfer>(`${Api.ConseillerNumerique}/geocode/${encodeURIComponent(address)}`)
      .pipe(map(coordinatesTransferToFirstCoordinates));
  }

  public search$(searchTerm: string): Observable<AddressFound[]> {
    return this.httpClient
      .get<AddressFoundTransfer>(`${Api.AdresseDataGouv}/search/?q=${encodeURIComponent(searchTerm)}&type=&autocomplete=1`)
      .pipe(map(addressFoundTransferToCore));
  }
}
