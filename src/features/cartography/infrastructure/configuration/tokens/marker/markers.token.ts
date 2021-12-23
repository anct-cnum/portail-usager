import { InjectionToken } from '@angular/core';
import {
  cnfsByRegionMarkerFactory,
  cnfsByDepartementMarkerFactory,
  cnfsMarkerFactory,
  usagerMarkerFactory
} from './markers.factories';
import { MarkersConfiguration } from './markers.configuration';

export const MARKERS_TOKEN: InjectionToken<MarkersConfiguration> = new InjectionToken<MarkersConfiguration>(
  'markers.configuration'
);

export enum Marker {
  Cnfs = 'cnfs',
  CnfsByRegion = 'cnfsByRegion',
  CnfsByDepartement = 'cnfsByDepartement',
  Usager = 'usager'
}

export const MARKERS: MarkersConfiguration = {
  [Marker.Cnfs]: cnfsMarkerFactory,
  [Marker.CnfsByRegion]: cnfsByRegionMarkerFactory,
  [Marker.CnfsByDepartement]: cnfsByDepartementMarkerFactory,
  [Marker.Usager]: usagerMarkerFactory
};
