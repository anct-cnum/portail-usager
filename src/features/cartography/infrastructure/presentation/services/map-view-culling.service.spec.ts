import { reduceCnfsProperties, MapViewCullingService } from './map-view-culling.service';
import { Feature, FeatureCollection, Point } from 'geojson';
import { ViewBox } from '../directives/leaflet-map-state-change';
import { CnfsPermanenceProperties } from '../models';
import { StructureProperties } from '../../../core';
import { emptyFeatureCollection } from '../helpers';

const FRANCE_VIEW_BOX: ViewBox = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  boundingBox: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const OUTSIDE_FRANCE_VIEW_BOX: ViewBox = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  boundingBox: [0, 0, 0, 0],
  zoomLevel: 6
};

const METROPOLITAN_FRANCE_CENTER_LONGITUDE: number = 4.468874066180609;
const METROPOLITAN_FRANCE_CENTER_LATITUDE: number = 46.28146057911664;

const IN_FRANCE_CNFS_FEATURE: Feature<Point, CnfsPermanenceProperties> = {
  geometry: {
    coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
    type: 'Point'
  },
  properties: {
    cnfs: [],
    structure: {} as StructureProperties
  },
  type: 'Feature'
};

const IN_AFRICA_CNFS_FEATURE: Feature<Point, CnfsPermanenceProperties> = {
  geometry: {
    coordinates: [46.28146057911664, 4.468874066180609],
    type: 'Point'
  },
  properties: {
    cnfs: [],
    structure: {} as StructureProperties
  },
  type: 'Feature'
};

const MAP_DATA_FRANCE_AND_AFRICA: FeatureCollection<Point, CnfsPermanenceProperties> = {
  features: [IN_FRANCE_CNFS_FEATURE, IN_AFRICA_CNFS_FEATURE],
  type: 'FeatureCollection'
};

const MAP_DATA_FRANCE: FeatureCollection<Point, CnfsPermanenceProperties> = {
  features: [IN_FRANCE_CNFS_FEATURE],
  type: 'FeatureCollection'
};

const SUPERPOSED_CNFS_PERMANENCE_FEATURE_COLLECTION: FeatureCollection<Point, CnfsPermanenceProperties> = {
  features: [
    {
      geometry: {
        coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
        type: 'Point'
      },
      properties: {
        cnfs: [],
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
        structure: {} as StructureProperties
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

describe('map view culling service', (): void => {
  it('should return empty collection if viewBox does not contain the features positions', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();
    const culledCollection: FeatureCollection<Point, CnfsPermanenceProperties> = mapViewCullingService.cull(
      MAP_DATA_FRANCE,
      OUTSIDE_FRANCE_VIEW_BOX
    );

    expect(culledCollection).toStrictEqual(emptyFeatureCollection<CnfsPermanenceProperties>());
  });

  it('should return features located in France', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();

    const culledCollection: FeatureCollection<Point, CnfsPermanenceProperties> = mapViewCullingService.cull(
      MAP_DATA_FRANCE_AND_AFRICA,
      FRANCE_VIEW_BOX
    );

    expect(culledCollection).toStrictEqual(MAP_DATA_FRANCE);
  });

  it('should aggregate points that are very close or superposed', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();
    const culledCollection: FeatureCollection<Point, CnfsPermanenceProperties> = mapViewCullingService.cull(
      SUPERPOSED_CNFS_PERMANENCE_FEATURE_COLLECTION,
      FRANCE_VIEW_BOX
    );

    const expectedCulledFeatureCollection: FeatureCollection<Point, CnfsPermanenceProperties> = {
      features: [
        {
          geometry: {
            coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
            type: 'Point'
          },
          properties: {
            cnfs: [],
            structure: {} as StructureProperties
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    expect(culledCollection).toStrictEqual(expectedCulledFeatureCollection);
  });
});

describe('service helpers', (): void => {
  it('should aggregate 2 cnfs permanence features into one', (): void => {
    const cnfsPermanenceJohn: Feature<Point, CnfsPermanenceProperties> = {
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
    const cnfsPermanenceJane: Feature<Point, CnfsPermanenceProperties> = {
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

    const aggregated: Feature<Point, CnfsPermanenceProperties> = reduceCnfsProperties(cnfsPermanenceJohn, cnfsPermanenceJane);

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
