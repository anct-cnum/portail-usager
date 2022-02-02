import { Observable } from 'rxjs';
import { UseCase } from '@architecture/use-case';
import { Coordinates, AddressRepository, NoCoordinateFoundForThisAddress } from '../../core';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class GeocodeAddressUseCase implements UseCase<[string], Coordinates | null> {
  public constructor(private readonly addressRepository: AddressRepository) {}

  public execute$(address: string): Observable<Coordinates> {
    return this.addressRepository.geocode$(address).pipe(
      map((coordinates: Coordinates | null): Coordinates => {
        if (coordinates == null) throw new NoCoordinateFoundForThisAddress(address);
        return coordinates;
      })
    );
  }
}
