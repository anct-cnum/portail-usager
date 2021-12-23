import { MarkerEvent, MarkerProperties } from '../markers';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { CITY_ZOOM_LEVEL } from '../../pages';
import { CenterView } from './center-view.presentation';

export const regionMarkerEventToCenterView = (
  markerEvent: MarkerEvent<MarkerProperties<CnfsByRegionProperties>>
): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: markerEvent.markerProperties.boundingZoom
});

export const departmentMarkerEventToCenterView = (
  markerEvent: MarkerEvent<MarkerProperties<CnfsByDepartmentProperties>>
): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: markerEvent.markerProperties.boundingZoom
});

export const permanenceMarkerEventToCenterView = (
  markerEvent: MarkerEvent<MarkerProperties<CnfsPermanenceProperties>>
): CenterView => ({
  coordinates: markerEvent.markerPosition,
  zoomLevel: CITY_ZOOM_LEVEL
});

export const coordinatesToCenterView = (coordinates: Coordinates): CenterView => ({
  coordinates,
  zoomLevel: CITY_ZOOM_LEVEL
});
