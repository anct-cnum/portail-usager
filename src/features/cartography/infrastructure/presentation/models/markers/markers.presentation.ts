import { CnfsByDepartementProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { Marker } from '../../../configuration';
import { CnfsPermanenceProperties } from '../cnfs-permanence';

export type CnfsMapDataProperties = CnfsByDepartementProperties | CnfsByRegionProperties | CnfsPermanenceProperties;

export type CnfsGroupedByProperties = {
  [K in keyof CnfsByDepartementProperties & keyof CnfsByRegionProperties]:
    | CnfsByDepartementProperties[K]
    | CnfsByRegionProperties[K];
};

export type MarkerProperties<T extends CnfsMapDataProperties> = T & {
  markerIconConfiguration: Marker;
  zIndexOffset?: number;
};

export interface MarkerEvent<T extends CnfsGroupedByProperties | CnfsMapDataProperties> {
  eventType: string;
  markerProperties: T;
  markerPosition: Coordinates;
}
