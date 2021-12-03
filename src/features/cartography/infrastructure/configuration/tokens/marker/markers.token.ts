import { InjectionToken } from '@angular/core';
import type { DivIconMarkerFactory, IconMarkerFactory } from './markers.factories';
import { cnfsClusterMarkerFactory, cnfsMarkerFactory, usagerMarkerFactory } from './markers.factories';

export type IconFactory = DivIconMarkerFactory | IconMarkerFactory;

export const MARKERS_TOKEN: InjectionToken<Record<Marker, IconFactory>> = new InjectionToken<Record<Marker, IconFactory>>(
  'markers.configuration'
);

export enum Marker {
  Cnfs = 'cnfs',
  CnfsCluster = 'cnfsCluster',
  Usager = 'usager'
}

export const MARKERS: Record<Marker, IconFactory> = {
  [Marker.Cnfs]: cnfsMarkerFactory,
  [Marker.CnfsCluster]: cnfsClusterMarkerFactory,
  [Marker.Usager]: usagerMarkerFactory
};
