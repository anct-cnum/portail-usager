import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { Marker } from '../../../configuration';
import { CnfsPermanenceProperties } from '../cnfs-permanence';

export type BoundedMarkers = CnfsByDepartmentProperties | CnfsByRegionProperties;

export type PointOfInterestMarkerProperties =
  | MarkerProperties<CnfsByDepartmentProperties>
  | MarkerProperties<CnfsByRegionProperties>
  | MarkerProperties<CnfsPermanenceProperties>;

export interface TypedMarker {
  markerType: Marker;
  zIndexOffset?: number;
}

export type MarkerProperties<T extends CnfsByDepartmentProperties | CnfsByRegionProperties | CnfsPermanenceProperties> = T &
  TypedMarker;

export interface MarkerEvent<T> {
  eventType: string;
  markerProperties: T;
  markerPosition: Coordinates;
}
