import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { Marker } from '../../../configuration';
import { CnfsPermanenceProperties } from '../cnfs-permanence';

export type CnfsMapDataProperties = CnfsByDepartmentProperties | CnfsByRegionProperties | CnfsPermanenceProperties;

export type PointOfInterestMarkers =
  | MarkerProperties<CnfsByDepartmentProperties>
  | MarkerProperties<CnfsByRegionProperties>
  | MarkerProperties<CnfsPermanenceProperties>;

export interface TypedMarker {
  markerType: Marker;
  zIndexOffset?: number;
}

export type MarkerProperties<T extends CnfsByDepartmentProperties | CnfsByRegionProperties | CnfsPermanenceProperties> = T &
  TypedMarker;

export interface MarkerEvent<T extends MarkerProperties<CnfsMapDataProperties>> {
  eventType: string;
  markerProperties: T;
  markerPosition: Coordinates;
}
