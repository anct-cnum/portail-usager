import type { MapOptions as LeafletMapOptions, Layer, LatLng, Icon } from 'leaflet';
import { DivIcon, geoJSON, icon, latLng, map, Map as LeafletMap, marker, tileLayer } from 'leaflet';
import type { AfterViewInit, ElementRef, OnChanges } from '@angular/core';
import { ChangeDetectionStrategy, Component, Inject, Input, ViewChild } from '@angular/core';
import type { MapOptionsPresentation, MarkerProperties } from '../../models';
import { AvailableMarkers, MARKERS_TOKEN } from '../../../configuration';
import type { MarkerConfiguration } from '../../../configuration';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { EMPTY_FEATURE_COLLECTION } from '../../models';

// TODO Convert configuration to injected token for default options then remove
const MAX_ZOOM_LEVEL: number = 19;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GeocodeAddressUseCase],
  selector: 'leaflet-map',
  templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
  private _map!: LeafletMap;
  private _mapOptions: LeafletMapOptions = {};
  private _markersLayer: Layer = geoJSON();

  @ViewChild('map')
  public mapContainer!: ElementRef<HTMLElement>;

  @Input()
  public markers: FeatureCollection<Point, MarkerProperties> = EMPTY_FEATURE_COLLECTION;

  public get map(): LeafletMap {
    return this._map;
  }

  @Input()
  public set mapOptions(mapOptions: MapOptionsPresentation) {
    // TODO Convert configuration to injected token for default options then remove
    this._mapOptions = {
      center: latLng(mapOptions.centerCoordinates.latitude, mapOptions.centerCoordinates.longitude),
      layers: [
        tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        })
      ],
      zoom: Math.min(mapOptions.zoomLevel, MAX_ZOOM_LEVEL)
    };
  }

  public constructor(
    @Inject(MARKERS_TOKEN) private readonly markersConfigurations: Record<AvailableMarkers, MarkerConfiguration>
  ) {}

  // TODO Comment rendre ça propre ?
  private getIcon(feature: Feature<Point, MarkerProperties>): DivIcon | Icon {
    if (feature.properties.markerIconConfiguration === AvailableMarkers.CnfsCluster) {
      return new DivIcon({
        className: 'cluster-icon',
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        html: `<div style='margin-top: 7px'>${feature.properties['point_count_abbreviated']}</div>`,
        iconAnchor: this.markersConfigurations[AvailableMarkers.CnfsCluster].iconAnchor,
        iconSize: this.markersConfigurations[AvailableMarkers.CnfsCluster].iconSize
      });
    }

    return icon(this.markersConfigurations[feature.properties.markerIconConfiguration]);
  }

  private initMap(): void {
    this._map = map(this.mapContainer.nativeElement, this._mapOptions);
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  public ngOnChanges(): void {
    if (!(this._map instanceof LeafletMap)) return;
    if (this._map.hasLayer(this._markersLayer)) this._map.removeLayer(this._markersLayer);

    this._markersLayer = geoJSON(this.markers, {
      // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/naming-convention
      pointToLayer: (feature: Feature<Point, MarkerProperties>, position: LatLng): Layer =>
        marker(position, { icon: this.getIcon(feature) })
    });
    //
    this._map.addLayer(this._markersLayer);
  }
}
