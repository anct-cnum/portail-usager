// TODO REVIEW IGNORE
/* eslint-disable */
import type { MapOptions as LeafletMapOptions, LatLng, Layer, IconOptions } from 'leaflet';
import { geoJSON, icon, latLng, map, Map as LeafletMap, marker, tileLayer } from 'leaflet';
import { AfterViewInit, ElementRef, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy, Component, Inject, Input, ViewChild } from '@angular/core';
import type { CnfsPresentation, MapOptionsPresentation } from '../../models';
import { AvailableMarkers, MARKERS_TOKEN } from '../../../configuration';
import type { MarkerConfiguration } from '../../../configuration';
import type { GeoJsonProperties } from 'geojson';
import Supercluster from 'supercluster';
import { FormControl } from '@angular/forms';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { Coordinates } from '../../../../core';

const EMPTY_MARKERS: CnfsPresentation = {
  features: [],
  type: 'FeatureCollection'
};

const MAX_ZOOM_LEVEL: number = 19;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GeocodeAddressUseCase],
  selector: 'leaflet-map',
  templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
  private _cnfsLayer!: Layer;
  private _map!: LeafletMap;
  private _mapOptions: LeafletMapOptions = {};

  public address: FormControl;

  @Input()
  public cnfsMarkers: CnfsPresentation = EMPTY_MARKERS;

  @Output() addressToGeocode = new EventEmitter<string>();

  @Output() usagerAutolocate = new EventEmitter<Coordinates>();

  @Input()
  public usagerCoordinates?: Coordinates | null;

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
          pointToLayer: (_, position: LatLng): Layer =>
            marker(position, { icon: icon(this.markersConfigurations[AvailableMarkers.Cnfs]) })
        })
      ],
      zoom: Math.min(mapOptions.zoomLevel, MAX_ZOOM_LEVEL)
    };
  }

  public constructor(
    @Inject(MARKERS_TOKEN) private readonly markersConfigurations: Record<AvailableMarkers, MarkerConfiguration>
  ) {
    this.address = new FormControl('');
  }

  private initMap(): void {
    this._map = map(this.mapContainer.nativeElement, this._mapOptions);
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  // TODO A améliorer / refactoriser
  public ngOnChanges(changes: SimpleChanges): void {
    if (!(this._map instanceof LeafletMap)) return;
    for (const propertyName in changes) {
      if (propertyName === 'cnfsMarkers') {
        if (this._map.hasLayer(this._cnfsLayer)) this._map.removeLayer(this._cnfsLayer);

        const index: Supercluster<GeoJsonProperties, GeoJsonProperties> = new Supercluster({
          maxZoom: 16,
          radius: 40
        } as Supercluster.Options<GeoJsonProperties, GeoJsonProperties>);

        index.load(this.cnfsMarkers.features);

        const presentation: CnfsPresentation = {
          features: index.getClusters(
            [
              this._map.getBounds().getWest(),
              this._map.getBounds().getSouth(),
              this._map.getBounds().getEast(),
              this._map.getBounds().getNorth()
            ],
            this._map.getZoom()
          ),
          type: 'FeatureCollection'
        };

        this._cnfsLayer = geoJSON(presentation, {
          // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/naming-convention
          pointToLayer: (_, position: LatLng): Layer =>
            marker(position, { icon: icon(this.markersConfigurations[AvailableMarkers.CnfsCluster]) })
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        this._map.addLayer(this._cnfsLayer);
      }

      if (propertyName === 'usagerCoordinates') {
        marker([this.usagerCoordinates!.latitude, this.usagerCoordinates!.longitude], {
          icon: icon(this.markersConfigurations[AvailableMarkers.Usager])
        }).addTo(this._map);
      }
    }
  }

  public geocode() {
    this.addressToGeocode.emit(this.address.value);
  }

  public locate() {
    const navigator: Navigator = window.navigator;
    navigator.geolocation.getCurrentPosition(
      (e: GeolocationPosition) => {
        this.emitLocation(e);
      },
      (e) => {
        alert(`Nous n'avons pas réussi à vous localiser : ${e.message}`);
      }
    );
  }

  public emitLocation(e: GeolocationPosition) {
    this.usagerAutolocate.emit(new Coordinates(e.coords.latitude, e.coords.longitude));
  }
}
