import type { MarkerProperties } from '../models';
import { EMPTY_FEATURE_COLLECTION } from '../models';
import { ViewCullingPipe } from './view-culling.pipe';

import { ClusterService } from '../services/cluster.service';
import { Marker } from '../../configuration';
import type { ViewBox } from '../directives/leaflet-map-state-change';
import type { Feature, Point } from 'geojson';

jest.mock('../services/cluster.service');

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/naming-convention
const ClusterServiceMock = ClusterService as jest.MockedClass<typeof ClusterService>;

// eslint-disable-next-line jest/require-hook,@typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any
(ClusterServiceMock as jest.MockInstance<any, any>).mockImplementation(() => ({
  getMarkerAtZoomLevel: (): Marker => Marker.Cnfs,
  isReady: (): boolean => true
}));

const DUMMY_VIEWBOX: ViewBox = {
  boundingBox: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const DUMMY_FEATURES: Feature<Point, MarkerProperties>[] = [
  {
    geometry: {
      coordinates: [0, 0],
      type: 'Point'
    },
    properties: { markerIconConfiguration: Marker.Cnfs },
    type: 'Feature'
  }
];

describe('ViewCulling pipe', (): void => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let pipeInstance: ViewCullingPipe;

  beforeEach((): void => {
    ClusterServiceMock.mockClear();
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    pipeInstance = new ViewCullingPipe(new ClusterServiceMock());

    // eslint-disable-next-line jest/prefer-spy-on,@typescript-eslint/dot-notation,@typescript-eslint/explicit-function-return-type
    pipeInstance['getFinalFeatures'] = jest.fn(() => DUMMY_FEATURES);
  });

  it('should return an empty collection if the viewbox is not defined', (): void => {
    expect(pipeInstance.transform()).toStrictEqual(EMPTY_FEATURE_COLLECTION);
  });

  it('should return a collection with one element', (): void => {
    expect(pipeInstance.transform(DUMMY_VIEWBOX)).toStrictEqual({
      features: DUMMY_FEATURES,
      type: 'FeatureCollection'
    });
  });

  it('should spiderify', (): void => {
    throw new Error('I have not done my test');
  });
});
