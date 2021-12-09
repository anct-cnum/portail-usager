import { DivIconMarkerFactory, IconMarkerFactory } from './markers.factories';
import { Marker } from './markers.token';

type IconFactory = DivIconMarkerFactory | IconMarkerFactory;
export type MarkersConfiguration = Record<Marker, IconFactory>;
