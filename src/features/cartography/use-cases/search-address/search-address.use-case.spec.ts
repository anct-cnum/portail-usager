import { firstValueFrom, Observable, of } from 'rxjs';
import { SearchAddressUseCase } from './search-address.use-case';
import { AddressFound, AddressRepository } from '../../core';

const ADDRESSES: AddressFound[] = [
  {
    context: '75, Paris, Île-de-France',
    label: 'Paris'
  },
  {
    context: '77, Seine-et-Marne, Île-de-France',
    label: 'Paris Foret 77760 Achères-la-Forêt'
  },
  {
    context: "83, Var, Provence-Alpes-Côte d'Azur",
    label: 'Paris 83170 Brignoles'
  },
  {
    context: '33, Gironde, Nouvelle-Aquitaine',
    label: 'Paris 33880 Saint-Caprais-de-Bordeaux'
  },
  {
    context: '37, Indre-et-Loire, Centre-Val de Loire',
    label: 'Paris Buton 37140 Bourgueil'
  }
];

const ADDRESS_REPOSITORY: AddressRepository = {
  search$(): Observable<AddressFound[]> {
    return of(ADDRESSES);
  }
} as unknown as AddressRepository;

describe('search address', (): void => {
  it('should get an address list from a search term', async (): Promise<void> => {
    const searchTerm: string = 'Paris';
    const searchAddressUseCase: SearchAddressUseCase = new SearchAddressUseCase(ADDRESS_REPOSITORY);

    const addressesFound: AddressFound[] = await firstValueFrom(searchAddressUseCase.execute$(searchTerm));

    expect(addressesFound).toStrictEqual(ADDRESSES);
  });
});
