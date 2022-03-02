import { Directive, Input, OnChanges, OnDestroy, Optional } from '@angular/core';
import { Layer, Point, tooltip, Tooltip } from 'leaflet';
import { CanHaveTooltipDirective } from '../_abstract';
import { LeafletMapComponent } from '../../components';

const MARKER_HEIGHT: number = 48;

@Directive({
  selector: 'leaflet-map-tooltip'
})
export class LeafletMapTooltipDirective implements OnDestroy, OnChanges {
  private _tooltip?: Tooltip;

  @Input() public content: HTMLElement | string = '';

  public constructor(
    private readonly _mapComponent: LeafletMapComponent,
    @Optional() private readonly _canHaveTooltip: CanHaveTooltipDirective<Layer> | null
  ) {}

  public ngOnChanges(): void {
    if (this._mapComponent.map == null) return;

    this._tooltip = tooltip().setContent(this.content);
    this._canHaveTooltip?.tooltipHolder?.bindTooltip(this._tooltip, {
      direction: 'top',
      offset: new Point(0, -MARKER_HEIGHT),
      opacity: 1
    });
  }

  public ngOnDestroy(): void {
    this._mapComponent.map != null && this._tooltip?.removeFrom(this._mapComponent.map);
    this._mapComponent.map?.closeTooltip(this._tooltip);
    this._canHaveTooltip?.tooltipHolder?.closeTooltip();
    this._canHaveTooltip?.tooltipHolder?.unbindTooltip();
  }
}
