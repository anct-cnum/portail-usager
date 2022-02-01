import { InjectionToken } from '@angular/core';
import {
  cnfsByRegionMarkerFactory,
  cnfsByDepartmentMarkerFactory,
  cnfsMarkerFactory,
  usagerMarkerFactory
} from './markers.factories';
import { MarkersConfiguration } from './markers.configuration';
import { DivIcon, Icon } from 'leaflet';

export const MARKERS_TOKEN: InjectionToken<MarkersConfiguration<never, DivIcon | Icon>> = new InjectionToken<
  MarkersConfiguration<never, DivIcon | Icon>
>('markers.configuration');

export enum MarkerKey {
  CnfsPermanence = 'cnfsPermanence',
  CnfsByRegion = 'cnfsByRegion',
  CnfsByDepartment = 'cnfsByDepartment',
  Usager = 'usager'
}

export const MARKERS: MarkersConfiguration<never, DivIcon | Icon> = {
  [MarkerKey.CnfsPermanence]: cnfsMarkerFactory,
  [MarkerKey.CnfsByRegion]: cnfsByRegionMarkerFactory,
  [MarkerKey.CnfsByDepartment]: cnfsByDepartmentMarkerFactory,
  [MarkerKey.Usager]: usagerMarkerFactory
};
