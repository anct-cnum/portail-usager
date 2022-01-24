import { Observable } from 'rxjs';
import { UseCase } from '@architecture/use-case';
import { AddressFound, AddressRepository } from '../../core';
import { Injectable } from '@angular/core';

@Injectable()
export class SearchAddressUseCase implements UseCase<[string], AddressFound[]> {
  public constructor(private readonly addressRepository: AddressRepository) {}

  public execute$(searchTerm: string): Observable<AddressFound[]> {
    return this.addressRepository.search$(searchTerm);
  }
}
