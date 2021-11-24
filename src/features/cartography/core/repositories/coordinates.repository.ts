import type { Observable } from 'rxjs';
import type { Coordinates } from '../../core';

export abstract class CoordinatesRepository {
  public abstract geocodeAddress$(address: string): Observable<Coordinates>;
}
