import { Injectable } from '@angular/core';
import type { PointFeature } from 'supercluster';
import Supercluster from 'supercluster';
import type { MarkerProperties } from '../models';
import { AvailableMarkers } from '../../configuration';

const CLUSTER_MAX_ZOOM_DISPLAY: number = 12;
const CLUSTER_RADIUS: number = 40;

@Injectable()
export class ClusterService {
  private _isReady: boolean = false;
  public readonly clusterRadius: number = CLUSTER_RADIUS;
  public readonly maxZoom: number = CLUSTER_MAX_ZOOM_DISPLAY;

  public get isReady(): boolean {
    return this._isReady;
  }

  public constructor(public readonly index: Supercluster<MarkerProperties, MarkerProperties>) {}

  public static initCluster(): Supercluster<MarkerProperties, MarkerProperties> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return new Supercluster({
      maxZoom: CLUSTER_MAX_ZOOM_DISPLAY,
      radius: CLUSTER_RADIUS
    } as Supercluster.Options<MarkerProperties, MarkerProperties>);
  }

  public getMarkerAtZoomLevel(zoomlevel: number): AvailableMarkers {
    return this.maxZoom >= zoomlevel ? AvailableMarkers.CnfsCluster : AvailableMarkers.Cnfs;
  }

  public load(points: PointFeature<MarkerProperties>[]): void {
    if (this._isReady) throw new Error('ClusterService data is already loaded !');
    this.index.load(points);
    this._isReady = true;
  }
}
