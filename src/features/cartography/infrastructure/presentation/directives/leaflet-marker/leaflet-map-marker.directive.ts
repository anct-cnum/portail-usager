import { Directive, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { DivIcon, Icon, LeafletEvent, marker, Marker, MarkerOptions } from 'leaflet';
import { LeafletMapComponent } from '../../components';
import { MarkerEvent, MarkerHighLight, MarkerProperties } from '../../models';
import { Coordinates } from '../../../../core';
import { MarkerKey, MARKERS_TOKEN, MarkersConfiguration } from '../../../configuration';
import { CanHavePopup, CanHavePopupDirective, CanHaveTooltip, CanHaveTooltipDirective } from '../_abstract';

@Directive({
  providers: [
    { provide: CanHavePopupDirective, useExisting: LeafletMapMarkerDirective },
    { provide: CanHaveTooltipDirective, useExisting: LeafletMapMarkerDirective }
  ],
  selector: 'leaflet-map-marker'
})
export class LeafletMapMarkerDirective<TProperty, TIcon extends DivIcon | Icon>
  implements OnChanges, OnDestroy, CanHavePopup<Marker>, CanHaveTooltip<Marker>
{
  private _marker?: Marker;

  @Input() public highlight?: MarkerHighLight;

  @Input() public latitude!: number;

  @Input() public longitude!: number;

  @Output() public readonly markerClick: EventEmitter<MarkerEvent<TProperty>> = new EventEmitter<MarkerEvent<TProperty>>();

  @Output() public readonly markerEnter: EventEmitter<MarkerEvent<TProperty>> = new EventEmitter<MarkerEvent<TProperty>>();

  @Input() public markerFactoryKey?: string;

  @Output() public readonly markerLeave: EventEmitter<MarkerEvent<TProperty>> = new EventEmitter<MarkerEvent<TProperty>>();

  @Input() public properties!: TProperty;

  public get popupHolder(): Marker | undefined {
    return this._marker;
  }

  public get tooltipHolder(): Marker | undefined {
    return this._marker;
  }

  public constructor(
    private readonly _mapComponent: LeafletMapComponent,
    @Inject(MARKERS_TOKEN) private readonly markersConfigurations: MarkersConfiguration<TProperty, TIcon>
  ) {}

  private bindClick(mapMarker: Marker): void {
    mapMarker.on('click', (leafletEvent: LeafletEvent): void => {
      this.markerClick.emit({
        eventType: leafletEvent.type,
        markerPosition: new Coordinates(this.latitude, this.longitude),
        markerProperties: this.properties
      });
    });
  }

  private bindMouseout(mapMarker: Marker): void {
    mapMarker.on('mouseout', (leafletEvent: LeafletEvent): void => {
      this.markerLeave.emit({
        eventType: leafletEvent.type,
        markerPosition: new Coordinates(this.latitude, this.longitude),
        markerProperties: this.properties
      });
    });
  }

  private bindMouseover(mapMarker: Marker): void {
    mapMarker.on('mouseover', (leafletEvent: LeafletEvent): void => {
      this.markerEnter.emit({
        eventType: leafletEvent.type,
        markerPosition: new Coordinates(this.latitude, this.longitude),
        markerProperties: this.properties
      });
    });
  }

  private markerOptions(): MarkerOptions {
    return this.markerFactoryKey == null
      ? {}
      : {
          icon: this.markersConfigurations[this.markerFactoryKey](this.toMarkerProperties())
        };
  }

  private toMarkerProperties(): MarkerProperties<TProperty> {
    return {
      ...this.properties,
      highlight: this.highlight,
      markerType: this.markerFactoryKey as MarkerKey,
      zIndexOffset: 0
    };
  }

  private unbindClick(): void {
    this._marker?.off('click');
  }

  private unbindMouseout(): void {
    this._marker?.off('mouseout');
  }

  private unbindMouseover(): void {
    this._marker?.off('mouseover');
  }

  public ngOnChanges(): void {
    if (this._mapComponent.map == null) return;

    this._marker?.removeFrom(this._mapComponent.map);
    this._marker = marker([this.latitude, this.longitude], this.markerOptions()).addTo(this._mapComponent.map);

    this.bindMouseover(this._marker);
    this.bindMouseout(this._marker);
    this.bindClick(this._marker);
  }

  public ngOnDestroy(): void {
    this._mapComponent.map != null && this._marker?.removeFrom(this._mapComponent.map);
    this.unbindClick();
    this.unbindMouseout();
    this.unbindMouseover();
  }
}
