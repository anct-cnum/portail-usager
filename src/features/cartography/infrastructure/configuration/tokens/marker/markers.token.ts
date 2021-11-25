import { InjectionToken } from '@angular/core';
import type { MarkerConfiguration } from './marker.configuration';
import { Point } from 'leaflet';

export const MARKERS_TOKEN: InjectionToken<Record<AvailableMarkers, MarkerConfiguration>> = new InjectionToken<
  Record<AvailableMarkers, MarkerConfiguration>
>('markers.configuration');

const HALF: number = 0.5;
const ROUND_FALSE: boolean = false;

const CNFS_MARKER_WIDTH_IN_PIXEL: number = 28.5;
const CNFS_MARKER_HEIGTH_IN_PIXEL: number = 48;
const CNFS_MARKER_DIMENSIONS: Point = new Point(CNFS_MARKER_WIDTH_IN_PIXEL, CNFS_MARKER_HEIGTH_IN_PIXEL, ROUND_FALSE);

const USAGER_MARKER_WIDTH_IN_PIXEL: number = 16;
const USAGER_MARKER_HEIGTH_IN_PIXEL: number = 16;
const USAGER_MARKER_DIMENSIONS: Point = new Point(USAGER_MARKER_WIDTH_IN_PIXEL, USAGER_MARKER_HEIGTH_IN_PIXEL, ROUND_FALSE);

export enum AvailableMarkers {
  Cnfs = 'cnfs',
  CnfsCluster = 'cnfsCluster',
  Usager = 'usager'
}

export const MARKERS: Record<AvailableMarkers, MarkerConfiguration> = {
  [AvailableMarkers.Cnfs]: {
    iconAnchor: new Point(CNFS_MARKER_DIMENSIONS.x * HALF, CNFS_MARKER_DIMENSIONS.y),
    iconSize: CNFS_MARKER_DIMENSIONS,
    iconUrl: 'assets/map/pin-cnfs.svg'
  },
  [AvailableMarkers.CnfsCluster]: {
    iconAnchor: new Point(CNFS_MARKER_DIMENSIONS.x * HALF, CNFS_MARKER_DIMENSIONS.y),
    iconSize: CNFS_MARKER_DIMENSIONS,
    iconUrl: 'assets/map/pin-cnfs-cluster.svg'
  },
  [AvailableMarkers.Usager]: {
    iconAnchor: new Point(USAGER_MARKER_DIMENSIONS.x * HALF, USAGER_MARKER_DIMENSIONS.y),
    iconSize: USAGER_MARKER_DIMENSIONS,
    iconUrl: 'assets/map/pin-usager.svg'
  }
};
