import { FeatureCollection, Point } from 'geojson';
import { Coordinates } from '../../../core';
import { CenterView, PointOfInterestMarkerProperties, TypedMarker } from '../models';
import { allowIfMapNotAtCityLevelOrCenterViewNotOnUsager, firstMarkerIsNotCnfsPermanence, usagerIsAlone } from './helpers';
import { CITY_ZOOM_LEVEL } from './map-constants';
import { Marker } from '../../configuration';

const MAP_INITIAL_ZOOM_LEVEL: number = 6;

describe('Zoom out logic', (): void => {
  describe('gateway for first automatic localisation step', (): void => {
    it('should allow passage if map is not at the city level', (): void => {
      const mapWithMarkerZoomLevel: number = MAP_INITIAL_ZOOM_LEVEL;
      const centerView: CenterView = { coordinates: new Coordinates(0, 0), zoomLevel: MAP_INITIAL_ZOOM_LEVEL };
      const usagerCoordinates: Coordinates = new Coordinates(0, 0);

      expect(allowIfMapNotAtCityLevelOrCenterViewNotOnUsager(mapWithMarkerZoomLevel, centerView, usagerCoordinates)).toBe(true);
    });
    it('should allow passage if the view is not centered on the usager', (): void => {
      const mapWithMarkerZoomLevel: number = CITY_ZOOM_LEVEL;
      const centerView: CenterView = { coordinates: new Coordinates(15, 45), zoomLevel: CITY_ZOOM_LEVEL };
      const usagerCoordinates: Coordinates = new Coordinates(23, 42);

      expect(allowIfMapNotAtCityLevelOrCenterViewNotOnUsager(mapWithMarkerZoomLevel, centerView, usagerCoordinates)).toBe(true);
    });
    it('should not allow passage if the view is already centered on the usager at the city zoom level', (): void => {
      const mapWithMarkerZoomLevel: number = CITY_ZOOM_LEVEL;
      const centerView: CenterView = { coordinates: new Coordinates(23, 42), zoomLevel: CITY_ZOOM_LEVEL };
      const usagerCoordinates: Coordinates = new Coordinates(23, 42);

      expect(allowIfMapNotAtCityLevelOrCenterViewNotOnUsager(mapWithMarkerZoomLevel, centerView, usagerCoordinates)).toBe(
        false
      );
    });
  });

  describe('gateway for subsequent localisation steps', (): void => {
    it('should allow passage if the usager is the only marker present', (): void => {
      const mapWithMarker: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> = {
        features: [
          {
            geometry: {
              coordinates: [0, 0],
              type: 'Point'
            },
            properties: {
              markerType: Marker.Usager
            },
            type: 'Feature'
          }
        ],
        type: 'FeatureCollection'
      };
      expect(usagerIsAlone(mapWithMarker)).toBe(true);
    });

    it('should allow passage if the first marker is not of type cnfsPermanence', (): void => {
      const mapWithMarker: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> = {
        features: [
          {
            geometry: {
              coordinates: [0, 0],
              type: 'Point'
            },
            properties: {
              markerType: Marker.CnfsByRegion
            },
            type: 'Feature'
          }
        ],
        type: 'FeatureCollection'
      };
      expect(firstMarkerIsNotCnfsPermanence(mapWithMarker)).toBe(true);
    });

    it('should allow passage if any of the the usagerIsAlone or firstMarkerIsNotCnfsPermanence rules are verified', (): void => {
      const mapWithMarker: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> = {
        features: [
          {
            geometry: {
              coordinates: [0, 0],
              type: 'Point'
            },
            properties: {
              markerType: Marker.CnfsByRegion
            },
            type: 'Feature'
          }
        ],
        type: 'FeatureCollection'
      };
      expect(firstMarkerIsNotCnfsPermanence(mapWithMarker)).toBe(true);
    });
  });
});
