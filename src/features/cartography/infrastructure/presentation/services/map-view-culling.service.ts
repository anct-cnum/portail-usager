import { Injectable } from '@angular/core';
import Supercluster from 'supercluster';
import { CnfsPermanenceProperties, CnfsProperties } from '../../../../../environments/environment.model';
import { ViewBox } from '../directives/leaflet-map-state-change';
import { Feature, FeatureCollection, Point } from 'geojson';
import { SPLIT_REGION_ZOOM } from '../pages';

const CLUSTER_RADIUS: number = 1;

type ClusterOrPointFeature =
  | Supercluster.ClusterFeature<CnfsPermanenceProperties>
  | Supercluster.PointFeature<CnfsPermanenceProperties>;

@Injectable()
export class MapViewCullingService {
  private _isReady: boolean = false;
  public readonly index: Supercluster<CnfsPermanenceProperties, CnfsPermanenceProperties> =
    MapViewCullingService.initClusters();

  public get isReady(): boolean {
    return this._isReady;
  }

  public static initClusters(): Supercluster<CnfsPermanenceProperties, CnfsPermanenceProperties> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return new Supercluster({
      maxZoom: 19,
      radius: CLUSTER_RADIUS
    } as Supercluster.Options<CnfsPermanenceProperties, CnfsPermanenceProperties>);
  }

  private getCulledPointFeatures(viewBox: ViewBox): Feature<Point, CnfsPermanenceProperties>[] {
    return this.index
      .getClusters(viewBox.boundingBox, viewBox.zoomLevel)
      .flatMap((clusterOrPointFeature: ClusterOrPointFeature): Feature<Point, CnfsPermanenceProperties>[] =>
        this.toPointFeatureArray(clusterOrPointFeature)
      );
  }

  private toPointFeatureArray(clusterOrPointFeature: ClusterOrPointFeature): Feature<Point, CnfsPermanenceProperties>[] {
    const { properties }: { properties: { cluster?: boolean; cnfs?: CnfsProperties } } = clusterOrPointFeature;
    if (properties.cluster === true) return this.index.getLeaves(Number(clusterOrPointFeature.id), Infinity);
    return [clusterOrPointFeature];
  }

  public cull(
    featureCollection: FeatureCollection<Point, CnfsPermanenceProperties>,
    viewBox: ViewBox
  ): FeatureCollection<Point, CnfsPermanenceProperties> {
    if (!this._isReady) {
      this.index.load(featureCollection.features);
      this._isReady = true;
    }

    return {
      features: this.getCulledPointFeatures(viewBox),
      type: 'FeatureCollection'
    };
  }
}
