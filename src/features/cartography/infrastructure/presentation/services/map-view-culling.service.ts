import { Injectable } from '@angular/core';
import Supercluster from 'supercluster';
import { ViewportAndZoom } from '../directives/leaflet-map-state-change';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceProperties, MarkerProperties } from '../models';
import { CnfsProperties } from '../../../core';
import { Marker } from '../../configuration';

const CLUSTER_RADIUS: number = 1;

type ClusterOrPointFeature =
  | Supercluster.ClusterFeature<MarkerProperties<CnfsPermanenceProperties>>
  | Supercluster.PointFeature<MarkerProperties<CnfsPermanenceProperties>>;

export const reduceCnfsProperties = (
  accumulator: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>,
  current: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>
): Feature<Point, MarkerProperties<CnfsPermanenceProperties>> => ({
  geometry: current.geometry,
  properties: {
    cnfs: accumulator.properties.cnfs.concat(current.properties.cnfs),
    markerType: Marker.CnfsPermanence,
    structure: { ...current.properties.structure }
  },
  type: 'Feature'
});

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
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return new Supercluster({
      maxZoom: 19,
      radius: CLUSTER_RADIUS
    } as Supercluster.Options<MarkerProperties<CnfsPermanenceProperties>, MarkerProperties<CnfsPermanenceProperties>>);
  }

  private aggregateInPermanence(
    clusterOrPointFeature:
      | Supercluster.ClusterFeature<MarkerProperties<CnfsPermanenceProperties>>
      | Supercluster.PointFeature<MarkerProperties<CnfsPermanenceProperties>>
  ): Feature<Point, MarkerProperties<CnfsPermanenceProperties>> {
    return this.index.getLeaves(Number(clusterOrPointFeature.id), Infinity).reduce(reduceCnfsProperties);
  }

  private getCulledPointFeatures(viewBox: ViewportAndZoom): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] {
    return this.index
      .getClusters(viewBox.viewport, viewBox.zoomLevel)
      .flatMap((clusterOrPointFeature: ClusterOrPointFeature): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] => [
        this.toSinglePointFeature(clusterOrPointFeature)
      ]);
  }

  private toSinglePointFeature(
    clusterOrPointFeature: ClusterOrPointFeature
  ): Feature<Point, MarkerProperties<CnfsPermanenceProperties>> {
    const { properties }: { properties: { cluster?: boolean; cnfs?: CnfsProperties[] } } = clusterOrPointFeature;
    if (properties.cluster === true) return this.aggregateInPermanence(clusterOrPointFeature);
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
