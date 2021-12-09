import { InjectionToken } from '@angular/core';
import { cnfsClusterMarkerFactory, cnfsMarkerFactory, usagerMarkerFactory } from './markers.factories';
import { MarkersConfiguration } from './markers.configuration';

export const MARKERS_TOKEN: InjectionToken<MarkersConfiguration> = new InjectionToken<MarkersConfiguration>(
  'markers.configuration'
);

export enum Marker {
  Cnfs = 'cnfs',
  CnfsCluster = 'cnfsCluster',
  Usager = 'usager'
}

export const MARKERS: MarkersConfiguration = {
  [Marker.Cnfs]: cnfsMarkerFactory,
  [Marker.CnfsCluster]: cnfsClusterMarkerFactory,
  [Marker.Usager]: usagerMarkerFactory
};
