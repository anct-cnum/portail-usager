import { DivIconMarkerFactory, IconMarkerFactory } from './markers.factories';
import { Marker } from './markers.token';
import { CnfsByDepartementProperties, CnfsByRegionProperties } from '../../../../core';

type IconFactory =
  | DivIconMarkerFactory<CnfsByDepartementProperties>
  | DivIconMarkerFactory<CnfsByRegionProperties>
  | IconMarkerFactory;
export type MarkersConfiguration = Record<Marker, IconFactory>;
