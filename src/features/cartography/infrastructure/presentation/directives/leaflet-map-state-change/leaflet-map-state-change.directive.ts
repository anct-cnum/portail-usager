import type { AfterViewInit, OnDestroy } from '@angular/core';
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
      boundingBox: this.getBoundingBox(this.mapComponent.map.getBounds()),
      center: this.mapComponent.map.getCenter(),
      zoomLevel: this.mapComponent.map.getZoom()
    });
  }

  private getBoundingBox(bounds: LatLngBounds): BBox {
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
