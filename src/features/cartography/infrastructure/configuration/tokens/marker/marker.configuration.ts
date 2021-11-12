import type { PointExpression } from 'leaflet';

export interface MarkerConfiguration {
  iconAnchor: PointExpression;
  iconSize: PointExpression;
  iconUrl: string;
}
