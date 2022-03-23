/* eslint-disable @typescript-eslint/naming-convention */

import { CartographyPresenter } from './cartography.presenter';
import { CnfsDetailsUseCase, GeocodeAddressUseCase, SearchAddressUseCase } from '../../../../use-cases';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AddressFound, CnfsDetails, CnfsType, Coordinates, StructureContact } from '../../../../core';
import {
  AddressFoundPresentation,
  CnfsDetailsPresentation,
  CnfsLocationPresentation,
  CnfsPermanenceMarkerProperties,
  DayPresentation,
  StructurePresentation
} from '../../models';
import { CnfsRest } from '../../../data/rest';
import { CnfsLocationTransfer } from '../../../data/models';
import { MarkerKey } from '../../../configuration';

const CNFS_DETAILS_USE_CASE: CnfsDetailsUseCase = {
  execute$(_: string): Observable<CnfsDetails> {
    return of({
      cnfs: [
        {
          email: 'christelle.bateau@conseiller-numerique.fr',
          fullName: 'Christelle Bateau',
          phone: '08 86 66 87 72'
        },
        {
          email: 'charles.desmoulins@conseiller-numerique.fr',
          fullName: 'Charles Desmoulins',
          phone: '03 86 55 24 40'
        }
      ],
      contact: new StructureContact('email@example.com', '03 86 55 26 40', 'https://www.test.com'),
      openingHours: ['9h30 - 17h30', '9h30 - 17h30', '9h30 - 17h30', '9h30 - 17h30', '9h30 - 17h30', '9h30 - 12h00'],
      position: new Coordinates(43.955, 6.053333),
      structureAddress: 'Place José Moron 3200 RIOM',
      structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
      type: CnfsType.Default
    });
  }
} as CnfsDetailsUseCase;

describe('cartography presenter', (): void => {
  describe('cnfs details', (): void => {
    it('should get cnfs details', async (): Promise<void> => {
      const expectedCnfsDetails: CnfsDetailsPresentation = {
        address: 'Place José Moron 3200 RIOM',
        cnfsList: [
          {
            email: 'christelle.bateau@conseiller-numerique.fr',
            fullName: 'Christelle Bateau',
            phone: '08 86 66 87 72'
          },
          {
            email: 'charles.desmoulins@conseiller-numerique.fr',
            fullName: 'Charles Desmoulins',
            phone: '03 86 55 24 40'
          }
        ],
        coordinates: new Coordinates(43.955, 6.053333),
        email: 'email@example.com',
        opening: [
          {
            day: DayPresentation.Monday,
            hours: '9h30 - 17h30'
          },
          {
            day: DayPresentation.Tuesday,
            hours: '9h30 - 17h30'
          },
          {
            day: DayPresentation.Wednesday,
            hours: '9h30 - 17h30'
          },
          {
            day: DayPresentation.Thursday,
            hours: '9h30 - 17h30'
          },
          {
            day: DayPresentation.Friday,
            hours: '9h30 - 17h30'
          },
          {
            day: DayPresentation.Saturday,
            hours: '9h30 - 12h00'
          }
        ],
        phone: '03 86 55 26 40',
        structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
        website: 'https://www.test.com'
      };

      const id: string = '4c38ebc9a06fdd532bf9d7be';

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        CNFS_DETAILS_USE_CASE,
        {} as GeocodeAddressUseCase,
        {} as SearchAddressUseCase,
        {} as CnfsRest
      );

      const cnfsDetails: CnfsDetailsPresentation = await firstValueFrom(cartographyPresenter.cnfsDetails$(id));

      expect(cnfsDetails).toStrictEqual(expectedCnfsDetails);
    });

    it('should get cnfs details with a Conseiller numérique France Service en Chambre d’Agriculture', async (): Promise<void> => {
      const cnfsDetailsUseCase: CnfsDetailsUseCase = {
        execute$(_: string): Observable<CnfsDetails> {
          return of({
            cnfs: [
              {
                email: 'christelle.bateau@conseiller-numerique.fr',
                fullName: 'Christelle Bateau',
                phone: '08 86 66 87 72'
              },
              {
                email: 'charles.desmoulins@conseiller-numerique.fr',
                fullName: 'Charles Desmoulins',
                phone: '03 86 55 24 40'
              }
            ],
            contact: new StructureContact('email@example.com', '03 86 55 26 40', 'https://www.test.com'),
            openingHours: ['9h30 - 17h30'],
            position: new Coordinates(43.955, 6.053333),
            structureAddress: 'Place José Moron 3200 RIOM',
            structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
            type: CnfsType.ChambreDAgriculture
          });
        }
      } as CnfsDetailsUseCase;

      const expectedCnfsDetails: CnfsDetailsPresentation = {
        address: 'Place José Moron 3200 RIOM',
        cnfsList: [
          {
            email: 'christelle.bateau@conseiller-numerique.fr',
            fullName: 'Christelle Bateau',
            phone: '08 86 66 87 72'
          },
          {
            email: 'charles.desmoulins@conseiller-numerique.fr',
            fullName: 'Charles Desmoulins',
            phone: '03 86 55 24 40'
          }
        ],
        cnfsTypeNote: "Un conseiller de cette structure est spécialisé dans l'accueil des professions agricoles",
        coordinates: new Coordinates(43.955, 6.053333),
        email: 'email@example.com',
        opening: [
          {
            day: DayPresentation.Monday,
            hours: '9h30 - 17h30'
          }
        ],
        phone: '03 86 55 26 40',
        structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
        website: 'https://www.test.com'
      };

      const id: string = '4c38ebc9a06fdd532bf9d7be';

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        cnfsDetailsUseCase,
        {} as GeocodeAddressUseCase,
        {} as SearchAddressUseCase,
        {} as CnfsRest
      );

      const cnfsDetails: CnfsDetailsPresentation = await firstValueFrom(cartographyPresenter.cnfsDetails$(id));

      expect(cnfsDetails).toStrictEqual(expectedCnfsDetails);
    });

    it('should get cnfs details with distance from usager', async (): Promise<void> => {
      const cnfsDetailsUseCase: CnfsDetailsUseCase = {
        execute$(_: string): Observable<CnfsDetails> {
          return of({
            cnfs: [],
            contact: new StructureContact('email@example.com', '03 86 55 26 40', 'https://www.test.com'),
            openingHours: [],
            position: new Coordinates(43.955, 6.053333),
            structureAddress: 'Place José Moron 3200 RIOM',
            structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
            type: CnfsType.ChambreDAgriculture
          });
        }
      } as CnfsDetailsUseCase;

      const expectedCnfsDetails: CnfsDetailsPresentation = {
        address: 'Place José Moron 3200 RIOM',
        cnfsList: [],
        cnfsTypeNote: "Un conseiller de cette structure est spécialisé dans l'accueil des professions agricoles",
        coordinates: new Coordinates(43.955, 6.053333),
        distanceFromUsager: '100.98 km',
        email: 'email@example.com',
        opening: [],
        phone: '03 86 55 26 40',
        structureName: 'Association Des Centres Sociaux Et Culturels Du Bassin De Riom',
        website: 'https://www.test.com'
      };

      const id: string = '4c38ebc9a06fdd532bf9d7be';

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        cnfsDetailsUseCase,
        {} as GeocodeAddressUseCase,
        {} as SearchAddressUseCase,
        {} as CnfsRest
      );

      cartographyPresenter.setUsagerCoordinates(new Coordinates(44.863, 6.075412));

      const cnfsDetails: CnfsDetailsPresentation = await firstValueFrom(cartographyPresenter.cnfsDetails$(id));

      expect(cnfsDetails).toStrictEqual(expectedCnfsDetails);
    });
  });

  describe('cnfs location', (): void => {
    it('should get cnfs location presentation matching given id', async (): Promise<void> => {
      const cnfsRest: CnfsRest = {
        cnfsLocation$: (): Observable<CnfsLocationTransfer> =>
          of({
            geometry: {
              coordinates: [-1.012996, 46.869512],
              type: 'Point'
            },
            properties: {},
            type: 'Feature'
          })
      } as unknown as CnfsRest;

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
        {} as GeocodeAddressUseCase,
        {} as SearchAddressUseCase,
        cnfsRest
      );

      const structureId: string = '88bc36fb0db191928330b1e6';

      const cnfsLocationPresentation: CnfsLocationPresentation = await firstValueFrom(
        cartographyPresenter.cnfsPosition$(structureId)
      );

      expect(cnfsLocationPresentation).toStrictEqual({
        coordinates: new Coordinates(46.869512, -1.012996),
        id: structureId
      });
    });
  });

  describe('structures list', (): void => {
    it(`should be empty if markers to display are not CnfsPermanence`, async (): Promise<void> => {
      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
        {} as GeocodeAddressUseCase,
        {} as SearchAddressUseCase,
        {} as CnfsRest
      );

      const structuresList: StructurePresentation[] = await firstValueFrom(cartographyPresenter.structuresList$(new Date()));

      expect(structuresList).toStrictEqual([]);
    });

    it('should be the structures of the visible Cnfs permanences', async (): Promise<void> => {
      const cnfsPermanences: CnfsPermanenceMarkerProperties[] = [
        {
          address: '12 rue des Acacias, 69002 Lyon',
          id: '4c38ebc9a06fdd532bf9d7be',
          isLabeledFranceServices: false,
          markerType: MarkerKey.CnfsPermanence,
          name: 'Association des centres sociaux et culturels de Lyon',
          position: new Coordinates(43.955, 6.053333)
        },
        {
          address: '31 Avenue de la mer, 13003 Marseille',
          id: '88bc36fb0db191928330b1e6',
          isLabeledFranceServices: true,
          markerType: MarkerKey.CnfsPermanence,
          name: 'Médiathèque de la mer',
          position: new Coordinates(46.869512, -1.012996)
        }
      ];

      const expectedStructureList: StructurePresentation[] = [
        {
          address: '12 rue des Acacias, 69002 Lyon',
          id: '4c38ebc9a06fdd532bf9d7be',
          isLabeledFranceServices: false,
          isOpen: false,
          name: 'Association des centres sociaux et culturels de Lyon'
        },
        {
          address: '31 Avenue de la mer, 13003 Marseille',
          id: '88bc36fb0db191928330b1e6',
          isLabeledFranceServices: true,
          isOpen: false,
          name: 'Médiathèque de la mer'
        }
      ];

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
        {} as GeocodeAddressUseCase,
        {} as SearchAddressUseCase,
        {} as CnfsRest
      );

      cartographyPresenter.setCnfsPermanences(cnfsPermanences);

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(new Date('2022-03-20'))
      );

      expect(structuresList).toStrictEqual(expectedStructureList);
    });

    it('should get structure liste with distance from usager when usager location is set', async (): Promise<void> => {
      const cnfsPermanences: CnfsPermanenceMarkerProperties[] = [
        {
          address: '12 rue des Acacias, 69002 Lyon',
          id: '4c38ebc9a06fdd532bf9d7be',
          isLabeledFranceServices: false,
          markerType: MarkerKey.CnfsPermanence,
          name: 'Association des centres sociaux et culturels de Lyon',
          position: new Coordinates(43.955, 6.053333)
        },
        {
          address: '31 Avenue de la mer, 13003 Marseille',
          id: '88bc36fb0db191928330b1e6',
          isLabeledFranceServices: true,
          markerType: MarkerKey.CnfsPermanence,
          name: 'Médiathèque de la mer',
          position: new Coordinates(46.869512, -1.012996)
        }
      ];

      const expectedStructureList: StructurePresentation[] = [
        {
          address: '12 rue des Acacias, 69002 Lyon',
          distanceFromUsager: '100.98 km',
          id: '4c38ebc9a06fdd532bf9d7be',
          isLabeledFranceServices: false,
          isOpen: false,
          name: 'Association des centres sociaux et culturels de Lyon'
        },
        {
          address: '31 Avenue de la mer, 13003 Marseille',
          distanceFromUsager: '592.19 km',
          id: '88bc36fb0db191928330b1e6',
          isLabeledFranceServices: true,
          isOpen: false,
          name: 'Médiathèque de la mer'
        }
      ];

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
        {} as GeocodeAddressUseCase,
        {} as SearchAddressUseCase,
        {} as CnfsRest
      );

      cartographyPresenter.setUsagerCoordinates(new Coordinates(44.863, 6.075412));

      cartographyPresenter.setCnfsPermanences(cnfsPermanences);

      const structuresList: StructurePresentation[] = await firstValueFrom(
        cartographyPresenter.structuresList$(new Date('2022-03-20'))
      );

      expect(structuresList).toStrictEqual(expectedStructureList);
    });

    it.each([
      {
        _desc: 'closed structure on 2022-03-15 at 10:00 (Tuesday), no opening hours',
        date: '2022-03-15T10:00:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: null,
        openingHours: []
      },
      {
        _desc: 'closed structure on 2022-03-20 (Sunday), open on Monday',
        date: '2022-03-20',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Monday,
        openingHours: ['9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-20 (Sunday), open on Tuesday',
        date: '2022-03-20',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Tuesday,
        openingHours: ['', '9h30 - 17h30']
      },
      {
        _desc: 'opened structure on 2022-03-15 at 12:00 (Tuesday)',
        date: '2022-03-15T12:00:00',
        expectedIsOpen: true,
        expectedNextOpeningDay: null,
        openingHours: ['', '9h30 - 17h30', '9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-15 at 09:25 (Tuesday), open today',
        date: '2022-03-15T09:25:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Tuesday,
        openingHours: ['', '9h30 - 17h30', '9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-15 at 17:35 (Tuesday), open on Wednesday',
        date: '2022-03-15T17:35:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Wednesday,
        openingHours: ['', '9h30 - 17h30', '9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-15 at 17:35 (Tuesday), open on next Tuesday',
        date: '2022-03-15T17:35:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Tuesday,
        openingHours: ['', '9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-15 at 09:00 (Tuesday) before it opens in the morning, open later today',
        date: '2022-03-15T09:00:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Tuesday,
        openingHours: ['', '9h30 - 12h30 | 14h30 - 17h30', '', '', '9h30 - 17h30']
      },
      {
        _desc: 'opened structure on 2022-03-15 at 10:00 (Tuesday) during morning opening hours',
        date: '2022-03-15T10:00:00',
        expectedIsOpen: true,
        expectedNextOpeningDay: null,
        openingHours: ['', '9h30 - 12h30 | 14h30 - 17h30', '', '', '9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-15 at 13:00 (Tuesday) during lunch time, open later today',
        date: '2022-03-15T13:00:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Tuesday,
        openingHours: ['', '9h30 - 12h30 | 14h30 - 17h30', '', '', '9h30 - 17h30']
      },
      {
        _desc: 'opened structure on 2022-03-15 at 15:00 (Tuesday) during afternoon opening hours',
        date: '2022-03-15T15:00:00',
        expectedIsOpen: true,
        expectedNextOpeningDay: null,
        openingHours: ['', '9h30 - 12h30 | 14h30 - 17h30', '', '', '9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-15 at 18:00 (Tuesday) after it closes in the afternoon, open on Friday',
        date: '2022-03-15T18:00:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Friday,
        openingHours: ['', '9h30 - 12h30 | 14h30 - 17h30', '', '', '9h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-15 at 18:00 (Tuesday) after it closes in the afternoon, open on next Tuesday',
        date: '2022-03-15T18:00:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Tuesday,
        openingHours: ['', '9h30 - 12h30 | 14h30 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-22 at 14:25 (Tuesday), open on Wednesday',
        date: '2022-03-22T14:25:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Wednesday,
        openingHours: ['', '', '4h00 - 6h00', '8h00 - 17h30']
      },
      {
        _desc: 'closed structure on 2022-03-23 at 8:30 (Wednesday), open on Monday',
        date: '2022-03-23T8:30:00',
        expectedIsOpen: false,
        expectedNextOpeningDay: DayPresentation.Monday,
        openingHours: ['8h00 - 17h30', '', '4h00 - 6h00']
      }
    ])(
      'should get structure liste containing a $_desc',
      async ({
        _desc,
        date,
        expectedIsOpen,
        expectedNextOpeningDay,
        openingHours
      }: {
        _desc: string;
        date: string;
        expectedIsOpen: boolean;
        expectedNextOpeningDay: DayPresentation | null;
        openingHours: string[];
      }): Promise<void> => {
        const cnfsPermanences: CnfsPermanenceMarkerProperties[] = [
          {
            address: '12 rue des Acacias, 69002 Lyon',
            id: '4c38ebc9a06fdd532bf9d7be',
            isLabeledFranceServices: false,
            markerType: MarkerKey.CnfsPermanence,
            name: 'Association des centres sociaux et culturels de Lyon',
            openingHours,
            position: new Coordinates(43.955, 6.053333)
          }
        ];

        const expectedStructureList: StructurePresentation[] = [
          {
            address: '12 rue des Acacias, 69002 Lyon',
            distanceFromUsager: '100.98 km',
            id: '4c38ebc9a06fdd532bf9d7be',
            isLabeledFranceServices: false,
            isOpen: expectedIsOpen,
            name: 'Association des centres sociaux et culturels de Lyon',
            ...(expectedNextOpeningDay == null
              ? {}
              : {
                  nextOpeningDay: expectedNextOpeningDay
                })
          }
        ];

        const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
          {} as CnfsDetailsUseCase,
          {} as GeocodeAddressUseCase,
          {} as SearchAddressUseCase,
          {} as CnfsRest
        );

        cartographyPresenter.setUsagerCoordinates(new Coordinates(44.863, 6.075412));

        cartographyPresenter.setCnfsPermanences(cnfsPermanences);

        const structuresList: StructurePresentation[] = await firstValueFrom(
          cartographyPresenter.structuresList$(new Date(date))
        );

        expect(structuresList).toStrictEqual(expectedStructureList);
      }
    );
  });

  describe('search address', (): void => {
    it('should get a list of address suggestions from an address search term', async (): Promise<void> => {
      const searchTerm: string = 'Paris';
      const searchAddressUseCase: SearchAddressUseCase = {
        execute$(): Observable<AddressFound[]> {
          return of([
            {
              context: '75, Paris, Île-de-France',
              label: 'Paris'
            }
          ]);
        }
      } as unknown as SearchAddressUseCase;

      const cartographyPresenter: CartographyPresenter = new CartographyPresenter(
        {} as CnfsDetailsUseCase,
        {} as GeocodeAddressUseCase,
        searchAddressUseCase,
        {} as CnfsRest
      );

      const addressesFound: AddressFoundPresentation[] = await firstValueFrom(cartographyPresenter.searchAddress$(searchTerm));

      expect(addressesFound).toStrictEqual([
        {
          context: '75, Paris, Île-de-France',
          label: 'Paris'
        }
      ]);
    });
  });
});
