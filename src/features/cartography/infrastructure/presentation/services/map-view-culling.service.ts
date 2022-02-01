import { Injectable } from '@angular/core';
import Supercluster from 'supercluster';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceProperties, MarkerProperties } from '../models';
import { ViewportAndZoom } from '../directives';

const CLUSTER_RADIUS: number = 1;

type ClusterOrPointFeature =
  | Supercluster.ClusterFeature<MarkerProperties<CnfsPermanenceProperties>>
  | Supercluster.PointFeature<MarkerProperties<CnfsPermanenceProperties>>;

@Injectable()
export class MapViewCullingService {
  private _isReady: boolean = false;
  public readonly index: Supercluster<MarkerProperties<CnfsPermanenceProperties>, MarkerProperties<CnfsPermanenceProperties>> =
    MapViewCullingService.initClusters();

  public get isReady(): boolean {
    return this._isReady;
  }

  public static initClusters(): Supercluster<
    MarkerProperties<CnfsPermanenceProperties>,
    MarkerProperties<CnfsPermanenceProperties>
  > {
    return new Supercluster({
      maxZoom: 19,
      radius: CLUSTER_RADIUS
    });
  }

  private getCulledPointFeatures(viewBox: ViewportAndZoom): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] {
    return this.index
      .getClusters(viewBox.viewport, viewBox.zoomLevel)
      .flatMap((clusterOrPointFeature: ClusterOrPointFeature): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] => [
        this.toSinglePointFeature(
          clusterOrPointFeature as Supercluster.ClusterFeature<MarkerProperties<CnfsPermanenceProperties>>
        )
      ]);
  }

  private toSinglePointFeature(
    clusterOrPointFeature: Supercluster.ClusterFeature<MarkerProperties<CnfsPermanenceProperties>>
  ): Feature<Point, MarkerProperties<CnfsPermanenceProperties>> {
    const { properties }: { properties: { cluster?: boolean } } = clusterOrPointFeature;
    if (properties.cluster === true) return this.index.getLeaves(Number(clusterOrPointFeature.id), 1)[0];
    return clusterOrPointFeature;
  }

  public cull(
    features: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[],
    viewBox: ViewportAndZoom
  ): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] {
    if (!this._isReady) {
      this.index.load(features);
      this._isReady = true;
    }

    return this.getCulledPointFeatures(viewBox);
  }
}
