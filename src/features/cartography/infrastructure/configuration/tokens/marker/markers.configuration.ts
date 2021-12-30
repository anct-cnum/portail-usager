import { DivIconMarkerFactory, IconMarkerFactory } from './markers.factories';
import { Marker } from './markers.token';
import { CnfsByRegionProperties } from '../../../../core';

type IconFactory = DivIconMarkerFactory<CnfsByRegionProperties> | IconMarkerFactory;
export type MarkersConfiguration = Record<Marker, IconFactory>;
