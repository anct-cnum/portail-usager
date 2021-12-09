import { Observable } from 'rxjs';
import { Coordinates } from '../../core';

export abstract class CoordinatesRepository {
  public abstract geocodeAddress$(address: string): Observable<Coordinates>;
}
