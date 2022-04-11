import { CnfsTransfer } from './cnfs.transfer';
import { Cnfs, Coordinates } from '../../../../core';
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
            address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
            id: '88bc36fb0db191928330b1e6',
            isLabeledFranceServices: false,
            name: 'CCAS des HERBIERS'
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [-0.64312, 45.741535],
            type: 'Point'
          },
          properties: {
            address: '2 RUE DES ROCHERS, 17100 SAINTES',
            id: '4c38ebc9a06fdd532bf9d7be',
            isLabeledFranceServices: false,
            name: 'SOLURIS  (SOLUTIONS NUMERIQUES TERRITORIALES INNOVANTES)'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const expectedCoreModels: Cnfs[] = [
      new Cnfs(new Coordinates(46.869512, -1.012996), {
        address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
        id: '88bc36fb0db191928330b1e6',
        isLabeledAidantsConnect: false,
        isLabeledFranceServices: false,
        name: 'CCAS des HERBIERS',
        position: new Coordinates(46.869512, -1.012996)
      }),
      new Cnfs(new Coordinates(45.741535, -0.64312), {
        address: '2 RUE DES ROCHERS, 17100 SAINTES',
        id: '4c38ebc9a06fdd532bf9d7be',
        isLabeledAidantsConnect: false,
        isLabeledFranceServices: false,
        name: 'SOLURIS  (SOLUTIONS NUMERIQUES TERRITORIALES INNOVANTES)',
        position: new Coordinates(45.741535, -0.64312)
      })
    ];

    expect(cnfsTransferToCore(transferFeatureCollection)).toStrictEqual(expectedCoreModels);
  });
});
