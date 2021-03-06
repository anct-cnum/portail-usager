import { Observable } from 'rxjs';
import { AddressFound, Coordinates } from '../../core';

export abstract class AddressRepository {
  public abstract geocode$(address: string): Observable<Coordinates | null>;

  public abstract search$(searchTerm: string): Observable<AddressFound[]>;
}
