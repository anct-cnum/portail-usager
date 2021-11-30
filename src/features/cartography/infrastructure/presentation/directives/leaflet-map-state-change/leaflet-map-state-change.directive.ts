import type { AfterViewInit } from '@angular/core';
import { Directive, EventEmitter, Output } from '@angular/core';
import type { BBox } from 'geojson';
import type { LatLng, LatLngBounds } from 'leaflet';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LeafletMapComponent } from '../../components';

export interface ViewBox {
  boundingBox: BBox;
  zoomLevel: number;
}

export interface ViewReset extends ViewBox {
  center: LatLng;
}

@Directive({
  selector: 'leaflet-map[stateChange]'
})
export class LeafletMapStateChangeDirective implements AfterViewInit {
  @Output() public readonly viewreset: EventEmitter<ViewReset> = new EventEmitter<ViewReset>();

  public constructor(public readonly mapComponent: LeafletMapComponent) {}

  private bindMoveEnd(): void {
    this.mapComponent.map.on('moveend', (): void => {
      this.emitViewReset();
    });
  }

  private bindViewReset(): void {
    this.mapComponent.map.on('viewreset', (): void => {
      this.emitViewReset();
    });
  }

  private bindZoomEnd(): void {
    this.mapComponent.map.on('zoomend', (): void => {
      this.emitViewReset();
    });
  }

  private emitViewReset(): void {
    this.viewreset.emit({
      boundingBox: this.getBoundingBox(this.mapComponent.map.getBounds()),
      center: this.mapComponent.map.getCenter(),
      zoomLevel: this.mapComponent.map.getZoom()
    });
  }

  private getBoundingBox(bounds: LatLngBounds): BBox {
    return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  }

  public ngAfterViewInit(): void {
    this.bindViewReset();
    this.bindZoomEnd();
    this.bindMoveEnd();
  }
}
