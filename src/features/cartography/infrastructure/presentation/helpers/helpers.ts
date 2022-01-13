import { Feature, FeatureCollection, Point } from 'geojson';
import { Coordinates } from '../../../core';
import { CenterView, PointOfInterestMarkerProperties, TypedMarker } from '../models';
import { Marker } from '../../configuration';
import { CITY_ZOOM_LEVEL } from './map-constants';

export const emptyFeatureCollection = <T>(): FeatureCollection<Point, T> => ({
  features: [],
  type: 'FeatureCollection'
});

export const usagerFeatureFromCoordinates = (coordinates: Coordinates): Feature<Point, TypedMarker> => ({
  geometry: {
    coordinates: [coordinates.longitude, coordinates.latitude],
    type: 'Point'
  },
  properties: {
    markerType: Marker.Usager,
    zIndexOffset: 1000
  },
  type: 'Feature'
});

const mapIsNotZoomedAtCityLevel = (mapWithMarkersZoomLevel: number): boolean => mapWithMarkersZoomLevel !== CITY_ZOOM_LEVEL;
const centerViewIsNotOnUsager = (centerViewCoordinates: Coordinates, usagerCoordinates: Coordinates): boolean =>
  centerViewCoordinates.latitude !== usagerCoordinates.latitude ||
  centerViewCoordinates.longitude !== usagerCoordinates.longitude;

export const allowIfMapNotAtCityLevelOrCenterViewNotOnUsager = (
  mapWithMarkersZoomLevel: number,
  centerView: CenterView,
  usagerCoordinates: Coordinates
): boolean =>
  mapIsNotZoomedAtCityLevel(mapWithMarkersZoomLevel) || centerViewIsNotOnUsager(centerView.coordinates, usagerCoordinates);

export const usagerIsAlone = (
  mapWithMarker: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>
): boolean => mapWithMarker.features.length === 1 && mapWithMarker.features[0].properties.markerType === Marker.Usager;

export const firstMarkerIsNotCnfsPermanence = (
  mapWithMarker: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>
): boolean => mapWithMarker.features[0].properties.markerType !== Marker.CnfsPermanence;

/*export const dezoomBehaviourGateway = (
  markersAndViewport: {
    markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>;
    viewportAndZoom: ViewportAndZoom;
  },
  centerView: CenterView
): boolean => {
  return allowIfFirstZoomToCityLevel();
};*/
