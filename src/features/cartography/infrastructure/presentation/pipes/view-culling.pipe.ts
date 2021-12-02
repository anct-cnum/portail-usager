import type { PipeTransform } from '@angular/core';
import { Inject, Pipe } from '@angular/core';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { ViewBox } from '../directives/leaflet-map-state-change';
import type { MarkerProperties } from '../models';
import { EMPTY_FEATURE_COLLECTION } from '../models';
import { AvailableMarkers } from '../../configuration';
import { ClusterService } from '../services/cluster.service';

@Pipe({ name: 'viewCulling' })
export class ViewCullingPipe implements PipeTransform {
  public constructor(@Inject(ClusterService) public readonly clusterService: ClusterService) {}

  private getClusterLeaves(cluster: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties>[] {
    if (cluster.properties['cluster'] === true) return this.clusterService.index.getLeaves(Number(cluster.id), Infinity);
    return [cluster];
  }

  private getFinalFeatures(viewbox: ViewBox, markerIcon: AvailableMarkers): Feature<Point, MarkerProperties>[] {
    return this.getFinalMarkersPositions(viewbox, markerIcon === AvailableMarkers.Cnfs).map(this.setMarkerIcon(markerIcon));
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

  // TODO Mieux gérer la logique d'attribution des marqueurs
  private setMarkerIcon(
    marker: AvailableMarkers
  ): (feature: Feature<Point, MarkerProperties>) => Feature<Point, MarkerProperties> {
    return (feature: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties> => ({
      ...feature,
      ...{ properties: { markerIconConfiguration: feature.properties['cluster'] === true ? marker : AvailableMarkers.Cnfs } }
    });
  }

  public transform(viewbox?: ViewBox | null): FeatureCollection<Point, MarkerProperties> {
    if (viewbox == null || !this.clusterService.isReady) return EMPTY_FEATURE_COLLECTION;

    const markerIcon: AvailableMarkers = this.clusterService.getMarkerAtZoomLevel(viewbox.zoomLevel);
    return {
      features: this.getFinalFeatures(viewbox, markerIcon),
      type: 'FeatureCollection'
    };
  }
}
