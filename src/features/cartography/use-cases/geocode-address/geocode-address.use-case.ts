import type { Observable } from 'rxjs';
import type { UseCase } from '@architecture/use-case';
import type { Coordinates } from '../../core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CoordinatesRepository } from '../../core';

import { Injectable } from '@angular/core';

@Injectable()
export class GeocodeAddressUseCase implements UseCase<[string], Coordinates> {
  public constructor(private readonly coordinatesRepository: CoordinatesRepository) {}

  public execute$(address: string): Observable<Coordinates> {
    return this.coordinatesRepository.geocodeAddress$(address);
  }
}
