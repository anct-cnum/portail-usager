import { CnfsByRegionProperties, Coordinates } from '../../../../core';
import { MarkerEvent, MarkerProperties } from '../markers';
import { MarkerKey } from '../../../configuration';
import { CenterView } from './center-view.presentation';
import {
  boundedMarkerEventToCenterView,
  coordinatesToCenterView,
  permanenceMarkerEventToCenterView
} from './center-view.presentation-mapper';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { CITY_ZOOM_LEVEL } from '../../helpers/map-constants';

describe('center view', (): void => {
  it('should map a markerEvent for a cnfs by region to a CenterView', (): void => {
    const palaisDeLElyseeCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

    const markerEvent: MarkerEvent<MarkerProperties<CnfsByRegionProperties>> = {
      eventType: 'click',
      markerPosition: palaisDeLElyseeCoordinates,
      markerProperties: {
        boundingZoom: 8,
        count: 6,
        markerType: MarkerKey.CnfsByRegion,
        region: 'Auvergne'
      }
    };

    const expectedCenterView: CenterView = {
      coordinates: palaisDeLElyseeCoordinates,
      zoomLevel: 8
    };

    expect(boundedMarkerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
  });

  it('should map a markerEvent for a cnfs permanence to a CenterView', (): void => {
    const palaisDeLElyseeCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

    const markerEvent: MarkerEvent<MarkerProperties<CnfsPermanenceProperties>> = {
      eventType: 'click',
      markerPosition: palaisDeLElyseeCoordinates,
      markerProperties: {
        address: '12 rue des Acacias, 69002 Lyon',
        id: '4c38ebc9a06fdd532bf9d7be',
        isLabeledFranceServices: false,
        markerType: MarkerKey.CnfsPermanence,
        name: 'Association des centres sociaux et culturels de Lyon'
      }
    };

    const expectedCenterView: CenterView = {
      coordinates: palaisDeLElyseeCoordinates,
      zoomLevel: 12
    };

    expect(permanenceMarkerEventToCenterView(markerEvent)).toStrictEqual(expectedCenterView);
  });

  it('should create a CenterView from map coordinates', (): void => {
    const usagerCoordinates: Coordinates = new Coordinates(48.87063, 2.316934);

    const expectedCenterView: CenterView = {
      coordinates: usagerCoordinates,
      zoomLevel: CITY_ZOOM_LEVEL
    };

    expect(coordinatesToCenterView(usagerCoordinates, CITY_ZOOM_LEVEL)).toStrictEqual(expectedCenterView);
  });
});
