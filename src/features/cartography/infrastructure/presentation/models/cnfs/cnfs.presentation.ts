import { FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { Coordinates, CnfsProperties, StructureProperties, CnfsByRegionProperties } from '../../../../core';

export interface CnfsPermanenceProperties {
  cnfs: CnfsProperties[];
  structure: StructureProperties;
}

export type MarkerProperties<T extends CnfsByRegionProperties | CnfsPermanenceProperties> = T & {
  markerIconConfiguration: Marker;
  zIndexOffset?: number;
};

export interface CenterView {
  coordinates: Coordinates;
  zoomLevel: number;
}

export interface MarkerEvent<T extends CnfsByRegionProperties | CnfsPermanenceProperties> {
  eventType: string;
  markerProperties: T;
  markerPosition: Coordinates;
}

export const emptyFeatureCollection = <T>(): FeatureCollection<Point, T> => ({
  features: [],
  type: 'FeatureCollection'
});
