import { MapViewCullingService } from './map-view-culling.service';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceProperties, MarkerProperties } from '../models';
import { MarkerKey } from '../../configuration';
import { ViewportAndZoom } from '../directives';

const FRANCE_VIEW_BOX: ViewportAndZoom = {
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const OUTSIDE_FRANCE_VIEW_BOX: ViewportAndZoom = {
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
    address: 'RUE DES PYRENEES, 31330 GRENADE',
    id: '4c38ebc9a06fdd532bf9d7be',
    isLabeledAidantsConnect: false,
    isLabeledFranceServices: false,
    markerType: MarkerKey.CnfsPermanence,
    name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS'
  },
  type: 'Feature'
};

const IN_AFRICA_CNFS_FEATURE: Feature<Point, MarkerProperties<CnfsPermanenceProperties>> = {
  geometry: {
    coordinates: [46.28146057911664, 4.468874066180609],
    type: 'Point'
  },
  properties: {
    address: 'RUE DES PYRENEES, 31330 GRENADE',
    id: '4c38ebc9a06fdd532bf9d7be',
    isLabeledAidantsConnect: false,
    isLabeledFranceServices: false,
    markerType: MarkerKey.CnfsPermanence,
    name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS'
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
      address: 'RUE DES PYRENEES, 31330 GRENADE',
      id: '4c38ebc9a06fdd532bf9d7be',
      isLabeledAidantsConnect: false,
      isLabeledFranceServices: false,
      markerType: MarkerKey.CnfsPermanence,
      name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS'
    },
    type: 'Feature'
  },
  {
    geometry: {
      coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
      type: 'Point'
    },
    properties: {
      address: 'RUE DES PYRENEES, 31330 GRENADE',
      id: '4c38ebc9a06fdd532bf9d7be',
      isLabeledAidantsConnect: false,
      isLabeledFranceServices: false,
      markerType: MarkerKey.CnfsPermanence,
      name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS'
    },
    type: 'Feature'
  },
  {
    geometry: {
      coordinates: [METROPOLITAN_FRANCE_CENTER_LONGITUDE, METROPOLITAN_FRANCE_CENTER_LATITUDE],
      type: 'Point'
    },
    properties: {
      address: 'RUE DES PYRENEES, 31330 GRENADE',
      id: '4c38ebc9a06fdd532bf9d7be',
      isLabeledAidantsConnect: false,
      isLabeledFranceServices: false,
      markerType: MarkerKey.CnfsPermanence,
      name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS'
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
          address: 'RUE DES PYRENEES, 31330 GRENADE',
          id: '4c38ebc9a06fdd532bf9d7be',
          isLabeledAidantsConnect: false,
          isLabeledFranceServices: false,
          markerType: MarkerKey.CnfsPermanence,
          name: 'COMMUNAUTE DE COMMUNES DES HAUTS-TOLOSANS'
        },
        type: 'Feature'
      }
    ];

    expect(culledFeatures).toStrictEqual(expectedCulledFeatures);
  });
});
