import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordinates, CoordinatesRepository } from '../../../../core';
import { Api } from '../../../../../../environments/environment.model';
import { CoordinatesTransfer, coordinatesTransferToFirstCoordinates } from '../../models';
import { map } from 'rxjs/operators';

@Injectable()
export class CoordinatesRest extends CoordinatesRepository {
  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {
    super();
  }

  public geocodeAddress$(address: string): Observable<Coordinates> {
    return this.httpClient
      .get<CoordinatesTransfer>(`${Api.ConseillerNumerique}/geocode/${address}`)
      .pipe(map(coordinatesTransferToFirstCoordinates));
  }
}
