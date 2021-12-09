import {
  geoJSON,
  latLng,
  LatLng,
  Layer,
  map,
  Map as LeafletMap,
  MapOptions as LeafletMapOptions,
  marker,
  tileLayer
} from 'leaflet';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { EMPTY_FEATURE_COLLECTION, MapOptionsPresentation, MarkerProperties } from '../../models';
import { MarkersConfiguration, MARKERS_TOKEN } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';

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
    @Inject(MARKERS_TOKEN)
    private readonly markersConfigurations: MarkersConfiguration
  ) {}

  private initMap(): void {
    this._map = map(this.mapContainer.nativeElement, this._mapOptions);
  }

  private mapIsInitialized(): boolean {
    return this._map instanceof LeafletMap;
  }

  private refreshMarkersLayer(): void {
    if (this._map.hasLayer(this._markersLayer)) this._map.removeLayer(this._markersLayer);

    this._markersLayer = geoJSON(this.markers, {
      // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/naming-convention
      pointToLayer: (feature: Feature<Point, MarkerProperties>, position: LatLng): Layer =>
        marker(position, {
          icon: this.markersConfigurations[feature.properties.markerIconConfiguration](feature),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          zIndexOffset: feature.properties['zIndexOffset'] ?? 0
        })
    });

    // TODO Lier le onclick au marqueur
    /*
     *  .on('click', () => {
     *  // emet l'event avec les properties du marqueur.
     *
     *  });
     */

    this._map.addLayer(this._markersLayer);
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  public ngOnChanges(): void {
    if (this.mapIsInitialized()) this.refreshMarkersLayer();
  }
}
