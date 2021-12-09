import { Injectable } from '@angular/core';
import { PointFeature } from 'supercluster';

// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import Supercluster from 'supercluster';

import { Marker } from '../../configuration';
import { AnyGeoJsonProperty } from '../../../../../environments/environment.model';

const CLUSTER_MAX_ZOOM_DISPLAY: number = 12;
const CLUSTER_RADIUS: number = 40;

@Injectable()
export class ClusterService {
  private _isReady: boolean = false;
  public readonly clusterRadius: number = CLUSTER_RADIUS;
  public readonly index: Supercluster<AnyGeoJsonProperty, AnyGeoJsonProperty> = ClusterService.initCluster();
  public readonly maxZoom: number = CLUSTER_MAX_ZOOM_DISPLAY;

  public get isReady(): boolean {
    return this._isReady;
  }

  public static initCluster(): Supercluster<AnyGeoJsonProperty, AnyGeoJsonProperty> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return new Supercluster({
      maxZoom: CLUSTER_MAX_ZOOM_DISPLAY,
      radius: CLUSTER_RADIUS
    } as Supercluster.Options<AnyGeoJsonProperty, AnyGeoJsonProperty>);
  }

  public exceedClusterZoomLevel(zoomlevel: number): boolean {
    return zoomlevel > this.maxZoom;
  }

  public getMarkerAtZoomLevel(zoomlevel: number): Marker {
    return this.exceedClusterZoomLevel(zoomlevel) ? Marker.Cnfs : Marker.CnfsCluster;
  }

  public load(points: PointFeature<AnyGeoJsonProperty>[]): void {
    if (this._isReady) throw new Error('ClusterService data is already loaded !');
    this.index.load(points);
    this._isReady = true;
  }
}
