import {
  control,
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
  Icon,
  ZoomPanOptions
} from 'leaflet';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CenterView, EMPTY_FEATURE_COLLECTION, MarkerEvent, MarkerProperties, MarkersPresentation } from '../../models';
import { MarkersConfiguration, CartographyConfiguration, MARKERS_TOKEN } from '../../../configuration';
import { Feature, Point } from 'geojson';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';
import { Coordinates } from '../../../../core';

// TODO Convert configuration to injected token for default options then remove
const MAX_ZOOM_LEVEL: number = 19;
const DURATION_IN_SECOND: number = 0.5;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GeocodeAddressUseCase],
  selector: 'leaflet-map',
  templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements AfterViewChecked {
  private _map!: LeafletMap;
  private _mapOptions: LeafletMapOptions = {};
  private _markersLayer: Layer = geoJSON();

  @Output() public readonly markerChange: EventEmitter<MarkerEvent> = new EventEmitter<MarkerEvent>();

  @Input() public markers: MarkersPresentation = EMPTY_FEATURE_COLLECTION;

  public get map(): LeafletMap {
    return this._map;
  }

  @Input()
  public set centerView(centerView: CenterView | null) {
    if (centerView !== null) this.setView(centerView.coordinates, centerView.zoomLevel);
  }

  @ViewChild('map')
  public set mapContainer(mapContainer: ElementRef<HTMLElement>) {
    this._map = map(mapContainer.nativeElement, this._mapOptions);
    control.zoom({ position: 'bottomright' }).addTo(this._map);
  }

  @Input()
  public set mapOptions(mapOptions: CartographyConfiguration) {
    // TODO Convert configuration to injected token for default options then remove
    this._mapOptions = {
      center: latLng(mapOptions.center.coordinates[1], mapOptions.center.coordinates[0]),
      layers: [
        tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
        })
      ],
      maxZoom: MAX_ZOOM_LEVEL,
      minZoom: 2.5,
      zoom: mapOptions.zoomLevel,
      zoomControl: false,
      zoomDelta: 0.5
    };
  }

  public constructor(
    @Inject(MARKERS_TOKEN)
    private readonly markersConfigurations: MarkersConfiguration
  ) {}

  // eslint-disable-next-line max-lines-per-function
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            markerPosition: new Coordinates(markerEvent.target._latlng.lat, markerEvent.target._latlng.lng),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            markerProperties: markerEvent.target?.feature?.properties as AnyGeoJsonProperty
          };
          this.markerChange.emit(payload);
        })
    );
  }

  public featureToMarker = (feature: Feature<Point, MarkerProperties>, position: LatLng): Layer =>
    this.createEventedMarker(
      position,
      feature,
      this.markersConfigurations[feature.properties.markerIconConfiguration](feature)
    );

  public ngAfterViewChecked(): void {
    if (this._map.hasLayer(this._markersLayer)) this._map.removeLayer(this._markersLayer);
    this._markersLayer = geoJSON(this.markers, { pointToLayer: this.featureToMarker });
    this._map.addLayer(this._markersLayer);
  }

  public setView(center: Coordinates, zoomLevel: number): void {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this._map.setView({ lat: center.latitude, lng: center.longitude }, zoomLevel, {
      animate: true,
      duration: DURATION_IN_SECOND
    } as ZoomPanOptions);
  }
}
