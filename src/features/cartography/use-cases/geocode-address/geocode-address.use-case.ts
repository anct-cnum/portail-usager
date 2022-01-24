import { Observable } from 'rxjs';
import { UseCase } from '@architecture/use-case';
import { Coordinates, AddressRepository } from '../../core';
import { Injectable } from '@angular/core';

@Injectable()
export class GeocodeAddressUseCase implements UseCase<[string], Coordinates> {
  public constructor(private readonly addressRepository: AddressRepository) {}

  public execute$(address: string): Observable<Coordinates> {
    return this.addressRepository.geocode$(address);
  }
}
