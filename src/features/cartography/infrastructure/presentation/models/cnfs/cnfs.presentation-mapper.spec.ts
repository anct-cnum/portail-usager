import { Cnfs, Coordinates } from '../../../../core';
import { CnfsPermanenceProperties } from '../../../../../../environments/environment.model';
import { FeatureCollection, Point } from 'geojson';
import { cnfsCoreToPresentation } from './cnfs.presentation-mapper';

describe('cnfs presentation mapper', (): void => {
  it('should map core model array to presentation model feature collection', (): void => {
    const coreModels: Cnfs[] = [
      new Cnfs(new Coordinates(46.869512, -1.012996), {
        cnfs: {
          email: 'john.doe@conseiller-numerique.fr',
          name: 'John Doe'
        },
        structure: {
          address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
          isLabeledFranceServices: false,
          name: 'CCAS des HERBIERS',
          phone: '0251912975',
          type: ''
        }
      }),
      new Cnfs(new Coordinates(45.741535, -0.64312), {
        cnfs: {
          email: 'jane.smith@conseiller-numerique.fr',
          name: 'Jane Smith'
        },
        structure: {
          address: '2 RUE DES ROCHERS, 17100 SAINTES',
          isLabeledFranceServices: false,
          name: 'SOLURIS  (SOLUTIONS NUMERIQUES TERRITORIALES INNOVANTES)',
          phone: '',
          type: ''
        }
      })
    ];

    const expectedPresentationModels: FeatureCollection<Point, CnfsPermanenceProperties> = {
      features: [
        {
          geometry: {
            coordinates: [-1.012996, 46.869512],
            type: 'Point'
          },
          properties: {
            cnfs: [
              {
                email: 'john.doe@conseiller-numerique.fr',
                name: 'John Doe'
              }
            ],
            structure: {
              address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
              isLabeledFranceServices: false,
              name: 'CCAS des HERBIERS',
              phone: '0251912975',
              type: ''
            }
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [-0.64312, 45.741535],
            type: 'Point'
          },
          properties: {
            cnfs: [
              {
                email: 'jane.smith@conseiller-numerique.fr',
                name: 'Jane Smith'
              }
            ],
            structure: {
              address: '2 RUE DES ROCHERS, 17100 SAINTES',
              isLabeledFranceServices: false,
              name: 'SOLURIS  (SOLUTIONS NUMERIQUES TERRITORIALES INNOVANTES)',
              phone: '',
              type: ''
            }
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    expect(cnfsCoreToPresentation(coreModels)).toStrictEqual(expectedPresentationModels);
  });
});
