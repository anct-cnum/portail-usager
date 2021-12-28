import { MapViewCullingService } from './map-view-culling.service';
import { CnfsPermanenceProperties, CnfsProperties, StructureProperties } from '../../../../../environments/environment.model';
import { Feature, FeatureCollection, Point } from 'geojson';
import { ViewBox } from '../directives/leaflet-map-state-change';
import { emptyFeatureCollection } from '../models';

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
    cnfs: {} as CnfsProperties,
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
    cnfs: {} as CnfsProperties,
    structure: {} as StructureProperties
  },
  type: 'Feature'
};

const MAP_DATA_FULL: FeatureCollection<Point, CnfsPermanenceProperties> = {
  features: [IN_FRANCE_CNFS_FEATURE, IN_AFRICA_CNFS_FEATURE],
  type: 'FeatureCollection'
};

const MAP_DATA_FRANCE: FeatureCollection<Point, CnfsPermanenceProperties> = {
  features: [IN_FRANCE_CNFS_FEATURE],
  type: 'FeatureCollection'
};

describe('map view culling service', (): void => {
  it('should return empty collection if viewBox does not contain features', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();
    const culledCollection: FeatureCollection<Point, CnfsPermanenceProperties> = mapViewCullingService.cull(
      MAP_DATA_FULL,
      OUTSIDE_FRANCE_VIEW_BOX
    );

    expect(culledCollection).toStrictEqual(emptyFeatureCollection<CnfsPermanenceProperties>());
  });

  it('should return features located in France', (): void => {
    const mapViewCullingService: MapViewCullingService = new MapViewCullingService();

    const culledCollection: FeatureCollection<Point, CnfsPermanenceProperties> = mapViewCullingService.cull(
      MAP_DATA_FULL,
      FRANCE_VIEW_BOX
    );

    expect(culledCollection).toStrictEqual(MAP_DATA_FRANCE);
  });
});
