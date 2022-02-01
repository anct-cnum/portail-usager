import { MarkerProperties } from '../../../presentation/models';
import { DivIcon, Icon } from 'leaflet';

export type MarkerFactory<TProperty, TIcon extends DivIcon | Icon> = (properties: MarkerProperties<TProperty>) => TIcon;

export type MarkersConfiguration<TProperty, TIcon extends DivIcon | Icon> = Record<string, MarkerFactory<TProperty, TIcon>>;
