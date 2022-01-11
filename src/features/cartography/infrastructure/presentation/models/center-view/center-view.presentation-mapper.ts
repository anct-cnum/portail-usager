import { BoundedMarkers, MarkerEvent, MarkerProperties } from '../markers';
import { Coordinates } from '../../../../core';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { CenterView } from './center-view.presentation';
import { CITY_ZOOM_LEVEL } from '../../helpers/map-constants';

export const coordinatesToCenterView = (coordinates: Coordinates, zoomLevel: number): CenterView => ({
  coordinates,
  zoomLevel
});

export const boundedMarkerEventToCenterView = (markerEvent: MarkerEvent<MarkerProperties<BoundedMarkers>>): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: markerEvent.markerProperties.boundingZoom
});

export const permanenceMarkerEventToCenterView = (
  markerEvent: MarkerEvent<MarkerProperties<CnfsPermanenceProperties>>
): CenterView => coordinatesToCenterView(markerEvent.markerPosition, CITY_ZOOM_LEVEL);
