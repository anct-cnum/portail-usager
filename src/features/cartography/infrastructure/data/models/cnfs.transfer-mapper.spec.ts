import { CnfsTransfer } from './cnfs.transfer';
import { Cnfs, Coordinates } from '../../../core';
import { cnfsTransferToCore } from './cnfs.transfer-mapper';

describe('cnfs transfer mapper', (): void => {
  it('should map transfer feature collection model to core model array', (): void => {
    const transferFeatureCollection: CnfsTransfer = {
      features: [
        {
          geometry: {
            coordinates: [-1.012996, 46.869512],
            type: 'Point'
          },
          properties: {
            conseiller: {
              email: 'john.doe@conseiller-numerique.fr',
              name: 'John Doe'
            },
            structure: {
              address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
              isLabeledFranceServices: false,
              name: 'CCAS des HERBIERS',
              phone: '0251912975'
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
            conseiller: {
              email: 'jane.smith@conseiller-numerique.fr',
              name: 'Jane Smith'
            },
            structure: {
              address: '2 RUE DES ROCHERS, 17100 SAINTES',
              isLabeledFranceServices: false,
              name: 'SOLURIS  (SOLUTIONS NUMERIQUES TERRITORIALES INNOVANTES)'
            }
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const expectedCoreModels: Cnfs[] = [
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

    expect(cnfsTransferToCore(transferFeatureCollection)).toStrictEqual(expectedCoreModels);
  });
});
