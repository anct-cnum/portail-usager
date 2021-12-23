import { InjectionToken } from '@angular/core';
import {
  cnfsByRegionMarkerFactory,
  cnfsByDepartmentMarkerFactory,
  cnfsMarkerFactory,
  usagerMarkerFactory
} from './markers.factories';
import { MarkersConfiguration } from './markers.configuration';

export const MARKERS_TOKEN: InjectionToken<MarkersConfiguration> = new InjectionToken<MarkersConfiguration>(
  'markers.configuration'
);

export enum Marker {
  CnfsPermanence = 'cnfsPermanence',
  CnfsByRegion = 'cnfsByRegion',
  CnfsByDepartment = 'cnfsByDepartment',
  Usager = 'usager'
}

export const MARKERS: MarkersConfiguration = {
  [Marker.CnfsPermanence]: cnfsMarkerFactory,
  [Marker.CnfsByRegion]: cnfsByRegionMarkerFactory,
  [Marker.CnfsByDepartment]: cnfsByDepartmentMarkerFactory,
  [Marker.Usager]: usagerMarkerFactory
};
