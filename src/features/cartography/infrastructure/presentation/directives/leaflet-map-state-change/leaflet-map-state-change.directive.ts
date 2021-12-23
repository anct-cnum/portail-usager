import { AfterViewInit, Directive, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BBox } from 'geojson';
import { LatLng, LatLngBounds } from 'leaflet';

import { LeafletMapComponent } from '../../components';

export interface ViewportAndZoom {
  viewport: BBox;
  zoomLevel: number;
}

export interface ViewReset extends ViewportAndZoom {
  center: LatLng;
}

@Directive({
  selector: 'leaflet-map[stateChange]'
})
export class LeafletMapStateChangeDirective implements AfterViewInit, OnDestroy {
  @Output() public readonly stateChange: EventEmitter<ViewReset> = new EventEmitter<ViewReset>();

  public constructor(public readonly mapComponent: LeafletMapComponent) {}

  private bindMoveEnd(): void {
    this.mapComponent.map.on('moveend', (): void => {
      this.emitStateChange();
    });
  }

  private bindViewReset(): void {
    this.mapComponent.map.on('viewreset', (): void => {
      this.emitStateChange();
    });
  }

  private bindZoomEnd(): void {
    this.mapComponent.map.on('zoomend', (): void => {
      this.emitStateChange();
    });
  }

  private emitStateChange(): void {
    this.stateChange.emit({
      center: this.mapComponent.map.getCenter(),
      viewport: this.getViewport(this.mapComponent.map.getBounds()),
      zoomLevel: this.mapComponent.map.getZoom()
    });
  }

  private getViewport(bounds: LatLngBounds): BBox {
    return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  }

  private unbindMoveEnd(): void {
    this.mapComponent.map.off('moveend', (): void => {
      this.emitStateChange();
    });
  }

  private unbindViewReset(): void {
    this.mapComponent.map.off('viewreset', (): void => {
      this.emitStateChange();
    });
  }

  private unbindZoomEnd(): void {
    this.mapComponent.map.off('zoomend', (): void => {
      this.emitStateChange();
    });
  }

  public ngAfterViewInit(): void {
    this.bindViewReset();
    this.bindZoomEnd();
    this.bindMoveEnd();
  }

  public ngOnDestroy(): void {
    this.unbindViewReset();
    this.unbindZoomEnd();
    this.unbindMoveEnd();
  }
}
