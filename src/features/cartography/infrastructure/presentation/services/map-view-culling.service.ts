import { Injectable } from '@angular/core';
import Supercluster from 'supercluster';
import { ViewBox } from '../directives/leaflet-map-state-change';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsPermanenceProperties } from '../models';
import { CnfsProperties } from '../../../core';

const CLUSTER_RADIUS: number = 1;

type ClusterOrPointFeature =
  | Supercluster.ClusterFeature<CnfsPermanenceProperties>
  | Supercluster.PointFeature<CnfsPermanenceProperties>;

export const reduceCnfsProperties = (
  accumulator: Feature<Point, CnfsPermanenceProperties>,
  current: Feature<Point, CnfsPermanenceProperties>
): Feature<Point, CnfsPermanenceProperties> => ({
  geometry: current.geometry,
  properties: {
    cnfs: accumulator.properties.cnfs.concat(current.properties.cnfs),
    structure: { ...current.properties.structure }
  },
  type: 'Feature'
});

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

  private aggregateInPermanence(
    clusterOrPointFeature:
      | Supercluster.ClusterFeature<CnfsPermanenceProperties>
      | Supercluster.PointFeature<CnfsPermanenceProperties>
  ): Feature<Point, CnfsPermanenceProperties> {
    return this.index.getLeaves(Number(clusterOrPointFeature.id), Infinity).reduce(reduceCnfsProperties);
  }

  private getCulledPointFeatures(viewBox: ViewBox): Feature<Point, CnfsPermanenceProperties>[] {
    return this.index
      .getClusters(viewBox.boundingBox, viewBox.zoomLevel)
      .flatMap((clusterOrPointFeature: ClusterOrPointFeature): Feature<Point, CnfsPermanenceProperties>[] => [
        this.toSinglePointFeature(clusterOrPointFeature)
      ]);
  }

  private toSinglePointFeature(clusterOrPointFeature: ClusterOrPointFeature): Feature<Point, CnfsPermanenceProperties> {
    const { properties }: { properties: { cluster?: boolean; cnfs?: CnfsProperties[] } } = clusterOrPointFeature;
    if (properties.cluster === true) return this.aggregateInPermanence(clusterOrPointFeature);
    return clusterOrPointFeature;
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
