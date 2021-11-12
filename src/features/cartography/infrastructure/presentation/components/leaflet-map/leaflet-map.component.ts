import type { Map as LeafletMap, MapOptions as LeafletMapOptions, LatLng, Layer, IconOptions } from 'leaflet';
import { geoJSON, icon, latLng, map, marker, tileLayer } from 'leaflet';
import type { AfterViewInit, ElementRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ChangeDetectionStrategy, Component, Inject, Input, ViewChild } from '@angular/core';
import type { CnfsPresentation, MapOptionsPresentation } from '../../models';
import { AvailableMarkers, MARKERS_TOKEN } from '../../../configuration';
import type { MarkerConfiguration } from '../../../configuration';

const EMPTY_MARKERS: CnfsPresentation = {
  features: [],
  type: 'FeatureCollection'
};

const MAX_ZOOM_LEVEL: number = 19;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'leaflet-map',
  templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
  private _cnfsLayer!: Layer;
  private readonly _cnfsMarkerConfig: IconOptions;
  private _map!: LeafletMap;
  private _mapOptions: LeafletMapOptions = {};

  @Input()
  public cnfsMarkers: CnfsPresentation = EMPTY_MARKERS;

  @ViewChild('map')
  public mapContainer!: ElementRef<HTMLElement>;

  @Input()
  public set mapOptions(mapOptions: MapOptionsPresentation) {
    // TODO Convert configuration to injected token for default options
    this._mapOptions = {
      center: latLng(mapOptions.centerCoordinates.latitude, mapOptions.centerCoordinates.longitude),
      layers: [
        tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        }),
        geoJSON(this.cnfsMarkers, {
          // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/naming-convention
          pointToLayer: (_, position: LatLng): Layer => marker(position, { icon: icon(this._cnfsMarkerConfig) })
        })
      ],
      zoom: Math.min(mapOptions.zoomLevel, MAX_ZOOM_LEVEL)
    };
  }

  public constructor(
    @Inject(MARKERS_TOKEN)
    private readonly markersConfigurations: Map<AvailableMarkers, MarkerConfiguration>
  ) {
    // TODO Meilleur moyen de partager ça ?
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._cnfsMarkerConfig = this.markersConfigurations.get(AvailableMarkers.CNFS)!;
  }

  private initMap(): void {
    this._map = map(this.mapContainer.nativeElement, this._mapOptions);
    // TODO Mettre la position de l'usager
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    marker([45.864043, 4.835659], {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      icon: icon(this.markersConfigurations.get(AvailableMarkers.USAGER)!)
    }).addTo(this._map);
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  // TODO A améliorer / refactoriser
  public ngOnChanges(changes: SimpleChanges): void {
    for (const propertyName in changes) {
      if (propertyName !== 'cnfsMarkers') continue;
      const changedProperty: SimpleChange = changes[propertyName];
      if (!changedProperty.isFirstChange()) this._map.removeLayer(this._cnfsLayer);

      this._cnfsLayer = geoJSON(this.cnfsMarkers, {
        // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/naming-convention
        pointToLayer: (_, position: LatLng): Layer => marker(position, { icon: icon(this._cnfsMarkerConfig) })
      });

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this._map?.addLayer(this._cnfsLayer);
    }
  }
}
