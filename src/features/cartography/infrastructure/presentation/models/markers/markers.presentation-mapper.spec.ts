import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { Marker } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { mapPositionsToMarkers, setMarkerIconByInference } from './markers.presentation-mapper';
import { CnfsByRegionProperties, StructureProperties } from '../../../../core';
import { MarkerProperties } from './markers.presentation';

describe('markers presentation mapper', (): void => {
  it('should affect the right markers icons according to the permanence numerique type', (): void => {
    const permanencesNumeriquesByRegion: FeatureCollection<Point, CnfsByRegionProperties> = {
      features: [
        {
          geometry: {
            coordinates: [-53.125782, 3.933889],
            type: 'Point'
          },
          properties: {
            boundingZoom: 8,
            count: 22,
            region: 'Guyane'
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [9.105278, 42.149722],
            type: 'Point'
          },
          properties: {
            boundingZoom: 9,
            count: 17,
            region: 'Corse'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const expectedVisibleMarkers: FeatureCollection<
      Point,
      MarkerProperties<CnfsByRegionProperties | CnfsPermanenceProperties>
    > = {
      features: [
        {
          geometry: {
            coordinates: [-53.125782, 3.933889],
            type: 'Point'
          },
          properties: {
            boundingZoom: 8,
            count: 22,
            markerIconConfiguration: Marker.CnfsByRegion,
            region: 'Guyane'
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [9.105278, 42.149722],
            type: 'Point'
          },
          properties: {
            boundingZoom: 9,
            count: 17,
            markerIconConfiguration: Marker.CnfsByRegion,
            region: 'Corse'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    expect(mapPositionsToMarkers(permanencesNumeriquesByRegion)).toStrictEqual(expectedVisibleMarkers);
  });
});

describe('markers presentation helpers', (): void => {
  it('should add markerIconProperty: Marker.Cnfs to the feature properties', (): void => {
    const permanenceNumeriquePosition: Feature<Point, CnfsPermanenceProperties> = {
      geometry: {
        coordinates: [0, 0],
        type: 'Point'
      },
      properties: {
        cnfs: [],
        structure: {} as StructureProperties
      },
      type: 'Feature'
    };

    const expectedPermanenceNumeriqueMarker: Feature<
      Point,
      MarkerProperties<CnfsByRegionProperties | CnfsPermanenceProperties>
    > = {
      geometry: {
        coordinates: [0, 0],
        type: 'Point'
      },
      properties: {
        cnfs: [],
        markerIconConfiguration: Marker.Cnfs,
        structure: {} as StructureProperties
      },
      type: 'Feature'
    };

    expect(setMarkerIconByInference(permanenceNumeriquePosition)).toStrictEqual(expectedPermanenceNumeriqueMarker);
  });

  it('should add markerIconProperty: Marker.CnfsByRegion to the feature properties', (): void => {
    const permanenceNumeriquePosition: Feature<Point, CnfsByRegionProperties> = {
      geometry: {
        coordinates: [-53.125782, 3.933889],
        type: 'Point'
      },
      properties: {
        boundingZoom: 8,
        count: 22,
        region: 'Guyane'
      },
      type: 'Feature'
    };

    const expectedPermanenceNumeriqueMarker: Feature<
      Point,
      MarkerProperties<CnfsByRegionProperties | CnfsPermanenceProperties>
    > = {
      geometry: {
        coordinates: [-53.125782, 3.933889],
        type: 'Point'
      },
      properties: {
        boundingZoom: 8,
        count: 22,
        markerIconConfiguration: Marker.CnfsByRegion,
        region: 'Guyane'
      },
      type: 'Feature'
    };

    expect(setMarkerIconByInference(permanenceNumeriquePosition)).toStrictEqual(expectedPermanenceNumeriqueMarker);
  });
});
