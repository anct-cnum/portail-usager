import { firstValueFrom, Observable, of } from 'rxjs';
import { AddressRepository, Coordinates, NoCoordinateFoundForThisAddress } from '../../core';
import { GeocodeAddressUseCase } from './geocode-address.use-case';

describe('geocode address', (): void => {
  it('should successfully geocode an address', async (): Promise<void> => {
    const expectedCoordinates: Coordinates = new Coordinates(46.869512, -1.012996);
    const addressRepository: AddressRepository = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      geocode$(_: string): Observable<Coordinates | null> {
        return of(expectedCoordinates);
      }
    } as AddressRepository;
    const geocodeAddressUseCase: GeocodeAddressUseCase = new GeocodeAddressUseCase(addressRepository);

    const coordinates: Coordinates | null = await firstValueFrom(geocodeAddressUseCase.execute$('75006'));

    expect(coordinates).toStrictEqual(expectedCoordinates);
  });

  it('should get an error when the address to geocode is invalid', async (): Promise<void> => {
    expect.assertions(1);

    const address: string = 'wrong address';
    const addressRepository: AddressRepository = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      geocode$(_: string): Observable<Coordinates | null> {
        return of(null);
      }
    } as AddressRepository;
    const geocodeAddressUseCase: GeocodeAddressUseCase = new GeocodeAddressUseCase(addressRepository);
    const expectedError: NoCoordinateFoundForThisAddress = new NoCoordinateFoundForThisAddress(address);

    try {
      await firstValueFrom(geocodeAddressUseCase.execute$(address));
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toStrictEqual(expectedError);
    }
  });
});
