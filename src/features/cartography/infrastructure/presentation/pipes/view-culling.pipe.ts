import type { PipeTransform } from '@angular/core';
import { Inject, Pipe } from '@angular/core';
import type { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import type { ViewBox } from '../directives/leaflet-map-state-change';
import type { MarkerProperties } from '../models';
import { EMPTY_FEATURE_COLLECTION } from '../models';
import { Marker } from '../../configuration';
import { ClusterService } from '../services/cluster.service';
import { each, groupBy } from 'lodash';

@Pipe({ name: 'viewCulling' })
export class ViewCullingPipe implements PipeTransform {
  public constructor(@Inject(ClusterService) public readonly clusterService: ClusterService) {}

  public static spiderifySuperposedMarkers(
    coordinates: Feature<Point, MarkerProperties>[]
  ): Feature<Point, MarkerProperties>[] {
    return coordinates.map((feature: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties> => {
      // eslint-disable-next-line no-param-reassign
      feature.geometry.coordinates = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
      return feature;
    });
  }

  private getClusterLeaves(cluster: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties>[] {
    if (cluster.properties['cluster'] === true) return this.clusterService.index.getLeaves(Number(cluster.id), Infinity);
    return [cluster];
  }

  private getFinalFeatures(viewbox: ViewBox, markerIcon: Marker): Feature<Point, MarkerProperties>[] {
    return this.getFinalMarkersPositions(viewbox, markerIcon === Marker.Cnfs).map(this.setClusterOrCnfsMarkerIcon(markerIcon));
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
  private setClusterOrCnfsMarkerIcon(
    marker: Marker
  ): (feature: Feature<Point, MarkerProperties>) => Feature<Point, MarkerProperties> {
    return (feature: Feature<Point, MarkerProperties>): Feature<Point, MarkerProperties> => ({
      ...feature,
      ...{ properties: this.mergeProperties(feature.properties, marker) }
    });
  }

  public isExpandedMode(markerIcon: Marker): boolean {
    return markerIcon === Marker.Cnfs;
  }

  public spiderifyIfNeeded(points: Feature<Point, MarkerProperties>[]): Feature<Point, MarkerProperties>[] {
    const groupedByCoordinate: { [key: string]: Feature<Point, MarkerProperties>[] } = groupBy(points, 'geometry.coordinates');
    const pointsToFlatten: Feature<Point, MarkerProperties>[][] = [];

    each(groupedByCoordinate, (coordinates: Feature<Point, MarkerProperties>[]): void => {
      if (coordinates.length === 1) pointsToFlatten.push(coordinates);
      pointsToFlatten.push(ViewCullingPipe.spiderifySuperposedMarkers(coordinates));
    });

    return pointsToFlatten.flat();
  }

  public transform(viewbox?: ViewBox | null): FeatureCollection<Point, MarkerProperties> {
    if (viewbox == null || !this.clusterService.isReady) return EMPTY_FEATURE_COLLECTION;

    const markerIcon: Marker = this.clusterService.getMarkerAtZoomLevel(viewbox.zoomLevel);
    const features: Feature<Point, MarkerProperties>[] = this.getFinalFeatures(viewbox, markerIcon);
    return {
      features: this.isExpandedMode(markerIcon) ? this.spiderifyIfNeeded(features) : features,
      type: 'FeatureCollection'
    };
  }
}
