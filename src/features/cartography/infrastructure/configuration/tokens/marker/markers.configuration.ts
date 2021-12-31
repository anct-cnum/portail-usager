import { DivIconMarkerFactory, IconMarkerFactory } from './markers.factories';
import { Marker } from './markers.token';
import { CnfsByDepartmentProperties, CnfsByRegionProperties } from '../../../../core';

type IconFactory =
  | DivIconMarkerFactory<CnfsByDepartmentProperties>
  | DivIconMarkerFactory<CnfsByRegionProperties>
  | IconMarkerFactory;
export type MarkersConfiguration = Record<Marker, IconFactory>;
