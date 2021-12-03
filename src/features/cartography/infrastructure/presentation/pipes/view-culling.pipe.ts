import type { PipeTransform } from '@angular/core';
import { Inject, Pipe } from '@angular/core';
import type { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import type { ViewBox } from '../directives/leaflet-map-state-change';
import type { MarkerProperties } from '../models';
import { EMPTY_FEATURE_COLLECTION } from '../models';
import { Marker } from '../../configuration';
import { ClusterService } from '../services/cluster.service';

@Pipe({ name: 'viewCulling' })
export class ViewCullingPipe implements PipeTransform {
  public constructor(@Inject(ClusterService) public readonly clusterService: ClusterService) {}

  private getClusterLeaves(cluster: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties>[] {
    if (cluster.properties['cluster'] === true) return this.clusterService.index.getLeaves(Number(cluster.id), Infinity);
    return [cluster];
  }

  private getFinalFeatures(viewbox: ViewBox, markerIcon: Marker): Feature<Point, MarkerProperties>[] {
    return this.getFinalMarkersPositions(viewbox, markerIcon === Marker.Cnfs).map(this.setMarkerIcon(markerIcon));
  }

  private getFinalMarkersPositions(viewbox: ViewBox, expandClusters: boolean): Feature<Point, MarkerProperties>[] {
    const clustersForViewbox: Feature<Point, MarkerProperties>[] = this.clusterService.index.getClusters(
      viewbox.boundingBox,
      viewbox.zoomLevel
    );

    if (expandClusters) {
      return clustersForViewbox.flatMap((cluster: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties>[] =>
        this.getClusterLeaves(cluster)
      );
    }

    return clustersForViewbox;
  }

  private mergeProperties(
    properties: MarkerProperties,
    marker: Marker
  ): GeoJsonProperties & { markerIconConfiguration: Marker } {
    return {
      ...properties,
      ...{ markerIconConfiguration: properties['cluster'] === true ? marker : Marker.Cnfs }
    };
  }

  // TODO Mieux gérer la logique d'attribution des marqueurs
  private setMarkerIcon(marker: Marker): (feature: Feature<Point, MarkerProperties>) => Feature<Point, MarkerProperties> {
    return (feature: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties> => ({
      ...feature,
      ...{ properties: this.mergeProperties(feature.properties, marker) }
    });
  }

  public transform(viewbox?: ViewBox | null): FeatureCollection<Point, MarkerProperties> {
    if (viewbox == null || !this.clusterService.isReady) return EMPTY_FEATURE_COLLECTION;

    const markerIcon: Marker = this.clusterService.getMarkerAtZoomLevel(viewbox.zoomLevel);
    return {
      features: this.getFinalFeatures(viewbox, markerIcon),
      type: 'FeatureCollection'
    };
  }
}
