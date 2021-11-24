import type { CnfsPresentation } from '../../infrastructure/presentation/models';
import type { CnfsTransfer } from '../../infrastructure/data/models';
import { cnfsData } from './data/cnfs-data';
import type { GeoJsonProperties, Point, Feature } from 'geojson';
import Supercluster from 'supercluster';

const MIN_LATITUDE: number = -90;
const MAX_LATITUDE: number = 90;
const MIN_LONGITUDE: number = -180;
const MAX_LONGITUDE: number = 180;
const CNFS_DATA: CnfsTransfer = cnfsData() as CnfsTransfer;
const ZOOM_LEVEL: number = 2;

const FIRST_MARKERS: CnfsPresentation = {
  features: [CNFS_DATA.features[0], CNFS_DATA.features[1], CNFS_DATA.features[2]],
  type: 'FeatureCollection'
};

describe('Supercluster integration', (): void => {
  const geojsonFeatureArray: CnfsPresentation = FIRST_MARKERS;

  it('should create a cluster array with 3 points in one cluster', (): void => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const index: Supercluster<GeoJsonProperties, GeoJsonProperties> = new Supercluster({
      maxZoom: 16,
      radius: 40
    } as Supercluster.Options<GeoJsonProperties, GeoJsonProperties>);
    index.load(geojsonFeatureArray.features);

    /* eslint-disable */
    expect(index.getClusters([MIN_LONGITUDE, MIN_LATITUDE, MAX_LONGITUDE, MAX_LATITUDE], ZOOM_LEVEL)).toMatchObject<
      Array<Feature<Point, GeoJsonProperties & Supercluster.ClusterProperties> | Feature<Point>>
    >(
      expect.arrayContaining([
        expect.objectContaining({
          geometry: expect.objectContaining({
            coordinates: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
            type: 'Point'
          }),
          id: expect.any(Number),
          properties: expect.objectContaining({
            cluster: true,
            cluster_id: expect.any(Number),
            point_count: 3,
            point_count_abbreviated: 3
          }),
          type: 'Feature'
        })
      ])
    );
    /* eslint-enable */
  });
});
