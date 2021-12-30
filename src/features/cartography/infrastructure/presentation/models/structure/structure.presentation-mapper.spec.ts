import { StructurePresentation } from './structure.presentation';
import { FeatureCollection, Point } from 'geojson';
import { mapPositionsToStructurePresentationArray } from './structure.presentation-mapper';
import { CnfsByRegionProperties } from '../../../../core';
import { CnfsPermanenceProperties } from '../cnfs';

describe('structure presentation mapper', (): void => {
  it('should map a map position to a StructurePresentation[]', (): void => {
    const visibleMarkers: FeatureCollection<Point, CnfsByRegionProperties | CnfsPermanenceProperties> = {
      features: [
        {
          geometry: {
            coordinates: [1.302737, 43.760536],
            type: 'Point'
          },
          properties: {
            cnfs: [
              {
                email: 'janette.smith@conseiller-numerique.fr',
                name: 'Janette Smith'
              }
            ],
            structure: {
              address: 'RUE DES PYRENEES, 31330 GRENADE',
              isLabeledFranceServices: false,
              name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
              phone: '0561828555',
              type: 'communauté de commune'
            }
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [1.302737, 43.760536],
            type: 'Point'
          },
          properties: {
            cnfs: [
              {
                email: 'henry.doe@conseiller-numerique.fr',
                name: 'Henry Doe'
              }
            ],
            structure: {
              address: 'RUE DES PYRENEES, 31330 GRENADE',
              isLabeledFranceServices: false,
              name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
              phone: '0561828555',
              type: 'communauté de commune'
            }
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [1.029654, 47.793923],
            type: 'Point'
          },
          properties: {
            cnfs: [
              {
                email: 'charles.doe@conseiller-numerique.fr',
                name: 'Charles Doe'
              }
            ],
            structure: {
              address: 'PL LOUIS LEYGUE, 41100 NAVEIL',
              isLabeledFranceServices: false,
              name: 'COMMUNE DE NAVEIL',
              phone: '0254735757',
              type: 'association'
            }
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const expectedStructurePresentation: StructurePresentation[] = [
      {
        address: 'RUE DES PYRENEES, 31330 GRENADE',
        isLabeledFranceServices: false,
        name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
        phone: '0561828555',
        type: 'communauté de commune'
      },
      {
        address: 'RUE DES PYRENEES, 31330 GRENADE',
        isLabeledFranceServices: false,
        name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
        phone: '0561828555',
        type: 'communauté de commune'
      },
      {
        address: 'PL LOUIS LEYGUE, 41100 NAVEIL',
        isLabeledFranceServices: false,
        name: 'COMMUNE DE NAVEIL',
        phone: '0254735757',
        type: 'association'
      }
    ];

    expect(mapPositionsToStructurePresentationArray(visibleMarkers)).toStrictEqual(expectedStructurePresentation);
  });
});
