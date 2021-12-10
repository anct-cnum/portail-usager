import {
  geoJSON,
  latLng,
  LatLng,
  Layer,
  map,
  Map as LeafletMap,
  MapOptions as LeafletMapOptions,
  marker,
  Marker as LeafletMarker,
  tileLayer,
  DivIcon,
  Icon
} from 'leaflet';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { EMPTY_FEATURE_COLLECTION, MapOptionsPresentation, MarkerEvent, MarkerProperties } from '../../models';
import { MarkersConfiguration, MARKERS_TOKEN } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';

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

  @Output() public readonly markerChange: EventEmitter<MarkerEvent> = new EventEmitter<MarkerEvent>();

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

  private createEventedMarker(
    position: LatLng,
    feature: Feature<Point, MarkerProperties>,
    iconMarker: DivIcon | Icon
  ): LeafletMarker {
    return (
      marker(position, { icon: iconMarker, zIndexOffset: (feature.properties['zIndexOffset'] ?? 0) as number })
        // WARNING : Typing 'event' will cause a error in leaflet.
        // eslint-disable-next-line @typescript-eslint/typedef
        .on('click', (markerEvent): void => {
          const payload: MarkerEvent = {
            eventType: markerEvent.type,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            markerProperties: markerEvent.target?.feature?.properties as AnyGeoJsonProperty
          };
          this.markerChange.emit(payload);
        })
    );
  }

  private initMap(): void {
    this._map = map(this.mapContainer.nativeElement, this._mapOptions);
  }

  private mapIsInitialized(): boolean {
    return this._map instanceof LeafletMap;
  }

  private refreshMarkersLayer(): void {
    if (this._map.hasLayer(this._markersLayer)) this._map.removeLayer(this._markersLayer);
    this._markersLayer = geoJSON(this.markers, { pointToLayer: this.featureToMarker });
    this._map.addLayer(this._markersLayer);
  }

  public featureToMarker = (feature: Feature<Point, MarkerProperties>, position: LatLng): Layer =>
    this.createEventedMarker(
      position,
      feature,
      this.markersConfigurations[feature.properties.markerIconConfiguration](feature)
    );

  public ngAfterViewInit(): void {
    this.initMap();
  }

  public ngOnChanges(): void {
    if (this.mapIsInitialized()) this.refreshMarkersLayer();
  }
}
