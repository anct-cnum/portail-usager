import { DivIconMarkerFactory, IconMarkerFactory } from './markers.factories';
import { Marker } from './markers.token';
import { CnfsByDepartmentProperties, CnfsByRegionProperties } from '../../../../core';
import { CnfsPermanenceMarkerProperties } from '../../../presentation/models';

type IconFactory =
  | DivIconMarkerFactory<CnfsByDepartmentProperties>
  | DivIconMarkerFactory<CnfsByRegionProperties>
  | IconMarkerFactory<CnfsPermanenceMarkerProperties>
  | IconMarkerFactory<null>;
export type MarkersConfiguration = Record<Marker, IconFactory>;
