import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { Marker } from '../../../configuration';
import { CnfsPermanenceProperties } from '../cnfs-permanence';

export type BoundedMarkers = CnfsByDepartmentProperties | CnfsByRegionProperties;

export type CnfsByDepartmentMarkerProperties = MarkerProperties<CnfsByDepartmentProperties>;

export type CnfsPermanenceMarkerProperties = MarkerProperties<CnfsPermanenceProperties>;

export type CnfsByRegionMarkerProperties = MarkerProperties<CnfsByRegionProperties>;

export type CnfsLocalityMarkerProperties = CnfsByDepartmentMarkerProperties | CnfsByRegionMarkerProperties;

export type PointOfInterestMarkerProperties = CnfsLocalityMarkerProperties | CnfsPermanenceMarkerProperties;

export interface TypedMarker {
  markerType: Marker;
  zIndexOffset?: number;
  highlight?: boolean;
}

export type MarkerProperties<T> = T & TypedMarker;

export interface MarkerEvent<T> {
  eventType: string;
  markerProperties: T;
  markerPosition: Coordinates;
}
