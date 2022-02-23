import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { MarkerKey } from '../../../configuration';
import { CnfsPermanenceProperties } from '../cnfs-permanence';

export type BoundedMarkers = CnfsByDepartmentProperties | CnfsByRegionProperties;

export type CnfsByDepartmentMarkerProperties = MarkerProperties<CnfsByDepartmentProperties>;

export type CnfsPermanenceMarkerProperties = MarkerProperties<CnfsPermanenceProperties>;

export type CnfsByRegionMarkerProperties = MarkerProperties<CnfsByRegionProperties>;

export type UsagerMarkerProperties = TypedMarker;

export type CnfsLocalityMarkerProperties = CnfsByDepartmentMarkerProperties | CnfsByRegionMarkerProperties;

export type PointOfInterestMarkerProperties = CnfsLocalityMarkerProperties | CnfsPermanenceMarkerProperties;

export enum MarkerHighLight {
  Focus = 'focus',
  Hint = 'hint'
}

export interface TypedMarker {
  markerType: MarkerKey;
  zIndexOffset?: number;
  highlight?: MarkerHighLight;
}

export type MarkerProperties<T> = T & TypedMarker;

export interface MarkerEvent<T> {
  eventType: string;
  markerProperties: T;
  markerPosition: Coordinates;
}
