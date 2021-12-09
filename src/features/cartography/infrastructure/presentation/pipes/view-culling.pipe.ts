import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Feature, FeatureCollection, Point } from 'geojson';
import { ViewBox } from '../directives/leaflet-map-state-change';
import { EMPTY_FEATURE_COLLECTION } from '../models';
import { ClusterService } from '../services/cluster.service';
import { AnyGeoJsonProperty } from '../../../../../environments/environment.model';

@Pipe({ name: 'viewCulling' })
export class ViewCullingPipe implements PipeTransform {
  public constructor(@Inject(ClusterService) public readonly clusterService: ClusterService) {}

  private getClusterLeaves(cluster: Feature<Point, AnyGeoJsonProperty>): Feature<Point, AnyGeoJsonProperty>[] {
    if (cluster.properties['cluster'] === true) return this.clusterService.index.getLeaves(Number(cluster.id), Infinity);
    return [cluster];
  }

  private getFinalFeatures(viewbox: ViewBox): Feature<Point, AnyGeoJsonProperty>[] {
    return this.getFinalMarkersPositions(viewbox);
  }

  private getFinalMarkersPositions(viewbox: ViewBox): Feature<Point, AnyGeoJsonProperty>[] {
    const clustersForViewbox: Feature<Point, AnyGeoJsonProperty>[] = this.clusterService.index.getClusters(
      viewbox.boundingBox,
      viewbox.zoomLevel
    );

    if (this.clusterService.exceedClusterZoomLevel(viewbox.zoomLevel)) {
      return clustersForViewbox.flatMap((cluster: Feature<Point, AnyGeoJsonProperty>): Feature<Point, AnyGeoJsonProperty>[] =>
        this.getClusterLeaves(cluster)
      );
    }

    return clustersForViewbox;
  }

  public transform(viewbox?: ViewBox | null): FeatureCollection<Point, AnyGeoJsonProperty> {
    if (viewbox == null || !this.clusterService.isReady) return EMPTY_FEATURE_COLLECTION;

    return {
      features: this.getFinalFeatures(viewbox),
      type: 'FeatureCollection'
    };
  }
}
