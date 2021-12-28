import { StructurePresentation } from './structure.presentation';
import { CnfsMapProperties } from '../../../../../../environments/environment.model';
import { FeatureCollection, Point } from 'geojson';
import { mapPositionsToStructurePresentationArray } from './structure.presentation-mapper';

describe('structure presentation mapper', (): void => {
  it('should map a MarkersPresentation to a StructurePresentation[]', (): void => {
    const visibleMarkers: FeatureCollection<Point, CnfsMapProperties> = {
      features: [
        {
          geometry: {
            coordinates: [1.302737, 43.760536],
            type: 'Point'
          },
          properties: {
            cnfs: {
              email: 'sylvie.reynes@conseiller-numerique.fr',
              name: 'Sylvie Reynès'
            },
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
            cnfs: {
              email: 'olivier.bouqueau@conseiller-numerique.fr',
              name: 'OLIVIER BOUQUEAU'
            },
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
            cnfs: {
              email: 'romain.boussion@conseiller-numerique.fr',
              name: 'Romain Boussion'
            },
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
