import { Directive, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { DivIcon, Icon, LeafletEvent, marker, Marker, MarkerOptions } from 'leaflet';
import { CanHavePopupDirective } from '../_abstract/can-have-popup.directive';
import { LeafletMapComponent } from '../../components';
import { MarkerEvent, MarkerProperties } from '../../models';
import { Coordinates } from '../../../../core';
import { MarkerKey, MARKERS_TOKEN, MarkersConfiguration } from '../../../configuration';

@Directive({
  providers: [{ provide: CanHavePopupDirective, useExisting: LeafletMapMarkerDirective }],
  selector: 'leaflet-map-marker'
})
export class LeafletMapMarkerDirective<TProperty, TIcon extends DivIcon | Icon>
  extends CanHavePopupDirective<Marker>
  implements OnChanges, OnDestroy
{
  private _marker?: Marker;

  @Input() public highlight: boolean = false;

  @Input() public latitude!: number;

  @Input() public longitude!: number;

  @Output() public readonly markerClick: EventEmitter<MarkerEvent<TProperty>> = new EventEmitter<MarkerEvent<TProperty>>();

  @Input() public markerFactoryKey?: string;

  @Input() public properties!: TProperty;

  public get popupHolder(): Marker | undefined {
    return this._marker;
  }

  public constructor(
    private readonly _mapComponent: LeafletMapComponent,
    @Inject(MARKERS_TOKEN) private readonly markersConfigurations: MarkersConfiguration<TProperty, TIcon>
  ) {
    super();
  }

  private markerOptions(): MarkerOptions {
    return this.markerFactoryKey == null
      ? {}
      : {
          icon: this.markersConfigurations[this.markerFactoryKey](this.toMarkerProperties())
        };
  }

  private onClick(leafletEvent: LeafletEvent): void {
    this.markerClick.emit({
      eventType: leafletEvent.type,
      markerPosition: new Coordinates(this.latitude, this.longitude),
      markerProperties: this.properties
    });
  }

  private toMarkerProperties(): MarkerProperties<TProperty> {
    return {
      ...this.properties,
      highlight: this.highlight,
      markerType: this.markerFactoryKey as MarkerKey,
      zIndexOffset: 0
    };
  }

  public ngOnChanges(): void {
    if (this._mapComponent.map == null) return;

    this._marker?.removeFrom(this._mapComponent.map);
    this._marker = marker([this.latitude, this.longitude], this.markerOptions())
      .addTo(this._mapComponent.map)
      .on('click', (leafletEvent: LeafletEvent): void => this.onClick(leafletEvent));
  }

  public ngOnDestroy(): void {
    this._mapComponent.map != null && this._marker?.removeFrom(this._mapComponent.map);
  }
}
