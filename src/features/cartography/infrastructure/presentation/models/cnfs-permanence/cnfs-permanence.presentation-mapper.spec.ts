import { Cnfs, Coordinates } from '../../../../core';
import { Feature, Point } from 'geojson';
import { cnfsCoreToCnfsPermanenceFeatures } from './cnfs-permanence.presentation-mapper';
import { CnfsPermanenceProperties } from './cnfs-permanence.presentation';
import { MarkerProperties } from '../markers';
import { Marker } from '../../../configuration';

describe('cnfs presentation mapper', (): void => {
  it('should map core model array to presentation model feature collection', (): void => {
    const coreModels: Cnfs[] = [
      new Cnfs(new Coordinates(46.869512, -1.012996), {
        address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
        id: '4c38ebc9a06fdd532bf9d7be',
        isLabeledFranceServices: false,
        name: 'CCAS des HERBIERS'
      }),
      new Cnfs(new Coordinates(45.741535, -0.64312), {
        address: '2 RUE DES ROCHERS, 17100 SAINTES',
        id: '88bc36fb0db191928330b1e6',
        isLabeledFranceServices: false,
        name: 'SOLURIS  (SOLUTIONS NUMERIQUES TERRITORIALES INNOVANTES)'
      })
    ];

    const expectedPresentationModels: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = [
      {
        geometry: {
          coordinates: [-1.012996, 46.869512],
          type: 'Point'
        },
        properties: {
          address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
          id: '4c38ebc9a06fdd532bf9d7be',
          isLabeledFranceServices: false,
          markerType: Marker.CnfsPermanence,
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
          id: '88bc36fb0db191928330b1e6',
          isLabeledFranceServices: false,
          markerType: Marker.CnfsPermanence,
          name: 'SOLURIS  (SOLUTIONS NUMERIQUES TERRITORIALES INNOVANTES)'
        },
        type: 'Feature'
      }
    ];

    expect(cnfsCoreToCnfsPermanenceFeatures(coreModels)).toStrictEqual(expectedPresentationModels);
  });
});
