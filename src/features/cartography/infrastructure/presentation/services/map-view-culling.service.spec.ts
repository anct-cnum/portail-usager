import { reduceCnfsProperties, MapViewCullingService } from './map-view-culling.service';
import { Feature, Point } from 'geojson';
import { ViewportAndZoom } from '../directives/leaflet-map-state-change';
import { CnfsPermanenceProperties, MarkerProperties } from '../models';
import { StructureProperties } from '../../../core';
import { Marker } from '../../configuration';

const FRANCE_VIEW_BOX: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const OUTSIDE_FRANCE_VIEW_BOX: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [0, 0, 0, 0],
  zoomLevel: 6
};

const METROPOLITAN_FRANCE_CENTER_LONGITUDE: number = 4.468874066180609;
const METROPOLITAN_FRANCE_CENTER_LATITUDE: number = 46.28146057911664;

const IN_FRANCE_CNFS_FEATURE: Feature<Point, MarkerProperties<CnfsPermanenceProperties>> = {
  geometry: {
    coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
    type: 'Point'
  },
  properties: {
    cnfs: [],
    markerType: Marker.CnfsPermanence,
    structure: {} as StructureProperties
  },
  type: 'Feature'
};

const IN_AFRICA_CNFS_FEATURE: Feature<Point, MarkerProperties<CnfsPermanenceProperties>> = {
  geometry: {
    coordinates: [46.28146057911664, 4.468874066180609],
    type: 'Point'
  },
  properties: {
    cnfs: [],
    markerType: Marker.CnfsPermanence,
    structure: {} as StructureProperties
  },
  type: 'Feature'
};

const SUPERPOSED_CNFS_PERMANENCE_FEATURES: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = [
  {
    geometry: {
      coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
      type: 'Point'
    },
    properties: {
      cnfs: [],
      markerType: Marker.CnfsPermanence,
      structure: {} as StructureProperties
    },
    type: 'Feature'
  },
  {
    geometry: {
      coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
      type: 'Point'
    },
    properties: {
      cnfs: [],
      markerType: Marker.CnfsPermanence,
      structure: {} as StructureProperties
    },
    type: 'Feature'
  },
  {
    geometry: {
      coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
      type: 'Point'
    },
    properties: {
      cnfs: [],
      markerType: Marker.CnfsPermanence,
      structure: {} as StructureProperties
    },
    type: 'Feature'
  }
];

describe('map view culling service', (): void => {
  it('should return empty collection if viewBox does not contain the features positions', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();
    const culledFeatures: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = mapViewCullingService.cull(
      [IN_FRANCE_CNFS_FEATURE],
      OUTSIDE_FRANCE_VIEW_BOX
    );

    expect(culledFeatures).toStrictEqual([]);
  });

  it('should return features located in France', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();

    const culledFeatures: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = mapViewCullingService.cull(
      [IN_FRANCE_CNFS_FEATURE, IN_AFRICA_CNFS_FEATURE],
      FRANCE_VIEW_BOX
    );

    expect(culledFeatures).toStrictEqual([IN_FRANCE_CNFS_FEATURE]);
  });

  it('should aggregate points that are very close or superposed', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();
    const culledFeatures: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = mapViewCullingService.cull(
      SUPERPOSED_CNFS_PERMANENCE_FEATURES,
      FRANCE_VIEW_BOX
    );

    const expectedCulledFeatures: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] = [
      {
        geometry: {
          coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
          type: 'Point'
        },
        properties: {
          cnfs: [],
          markerType: Marker.CnfsPermanence,
          structure: {} as StructureProperties
        },
        type: 'Feature'
      }
    ];

    expect(culledFeatures).toStrictEqual(expectedCulledFeatures);
  });
});

describe('service helpers', (): void => {
  it('should aggregate 2 cnfs permanence features into one', (): void => {
    const cnfsPermanenceJohn: Feature<Point, MarkerProperties<CnfsPermanenceProperties>> = {
      geometry: {
        coordinates: [1.302737, 43.760536],
        type: 'Point'
      },
      properties: {
        cnfs: [
          {
            email: 'john.doe@conseiller-numerique.fr',
            name: 'John Doe'
          }
        ],
        markerType: Marker.CnfsPermanence,
        structure: {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        }
      },
      type: 'Feature'
    };
    const cnfsPermanenceJane: Feature<Point, MarkerProperties<CnfsPermanenceProperties>> = {
      geometry: {
        coordinates: [1.302737, 43.760536],
        type: 'Point'
      },
      properties: {
        cnfs: [
          {
            email: 'jane.smith@conseiller-numerique.fr',
            name: 'Jane Smith'
          }
        ],
        markerType: Marker.CnfsPermanence,
        structure: {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        }
      },
      type: 'Feature'
    };

    const aggregated: Feature<Point, MarkerProperties<CnfsPermanenceProperties>> = reduceCnfsProperties(
      cnfsPermanenceJohn,
      cnfsPermanenceJane
    );

    expect(aggregated).toStrictEqual({
      geometry: {
        coordinates: [1.302737, 43.760536],
        type: 'Point'
      },
      properties: {
        cnfs: [
          {
            email: 'john.doe@conseiller-numerique.fr',
            name: 'John Doe'
          },
          {
            email: 'jane.smith@conseiller-numerique.fr',
            name: 'Jane Smith'
          }
        ],
        markerType: Marker.CnfsPermanence,
        structure: {
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          isLabeledFranceServices: false,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS',
          phone: '0561828555',
          type: 'communauté de commune'
        }
      },
      type: 'Feature'
    });
  });
});
