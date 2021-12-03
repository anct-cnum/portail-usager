import type { DivIconMarkerFactory, IconMarkerFactory } from './markers.factories';
import type { Marker } from './markers.token';

type IconFactory = DivIconMarkerFactory | IconMarkerFactory;
export type MarkersConfiguration = Record<Marker, IconFactory>;
