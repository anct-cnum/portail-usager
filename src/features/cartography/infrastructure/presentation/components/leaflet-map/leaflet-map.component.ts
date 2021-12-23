// TODO Remove !!!
/* eslint-disable max-lines */
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
  Icon
} from 'leaflet';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CenterView, MarkerEvent, MarkerProperties, PointOfInterestMarkerProperties, TypedMarker } from '../../models';
import { MarkersConfiguration, MARKERS_TOKEN } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { emptyFeatureCollection } from '../../helpers';

// TODO Convert configuration to injected token for default options then remove
const ANIMATION_DURATION_IN_SECONDS: number = 0.5;
// TODO Convert configuration to injected token for default options then remove
const MAP_OPTIONS: LeafletMapOptions = {
  layers: [
    tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    })
  ],
  maxZoom: 18,
  minZoom: 2.5,
  zoomAnimationThreshold: 12,
  zoomControl: false,
  zoomDelta: 0.5
};
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LONGITUDE: number = 4.468874066180609;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LATITUDE: number = 46.28146057911664;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_ZOOM_LEVEL: number = 6;

const shouldSetView = (centerViewChange: SimpleChange | undefined): boolean => !(centerViewChange?.firstChange ?? true);

const currentValue = <T>(simpleChange: SimpleChange | undefined): T => simpleChange?.currentValue as T;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GeocodeAddressUseCase],
  selector: 'leaflet-map',
  templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements AfterViewChecked, OnChanges {
  private _map!: LeafletMap;
  private _markersLayer: Layer = geoJSON();

  @Input() public centerView: CenterView = {
    coordinates: new Coordinates(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
    zoomLevel: DEFAULT_ZOOM_LEVEL
  };

  @Output() public readonly markerChange: EventEmitter<MarkerEvent<PointOfInterestMarkerProperties>> = new EventEmitter<
    MarkerEvent<PointOfInterestMarkerProperties>
  >();

  @Input() public markers: FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> = emptyFeatureCollection<
    PointOfInterestMarkerProperties | TypedMarker
  >();

  public get map(): LeafletMap {
    return this._map;
  }

  @ViewChild('map')
  public set mapContainer(mapContainer: ElementRef<HTMLElement>) {
    this._map = map(mapContainer.nativeElement, {
      ...MAP_OPTIONS,
      center: latLng(this.centerView.coordinates.latitude, this.centerView.coordinates.longitude),
      zoom: this.centerView.zoomLevel
    });
    control.zoom({ position: 'bottomright' }).addTo(this._map);
  }

  public constructor(@Inject(MARKERS_TOKEN) private readonly markersConfigurations: MarkersConfiguration) {}

  // eslint-disable-next-line max-lines-per-function
  private createEventedMarker(
    position: LatLng,
    feature: Feature<Point, PointOfInterestMarkerProperties>,
    iconMarker: DivIcon | Icon
  ): LeafletMarker {
    return (
      marker(position, { icon: iconMarker, zIndexOffset: feature.properties.zIndexOffset ?? 0 })
        // WARNING : Typing 'event' will cause a error in leaflet.
        // eslint-disable-next-line @typescript-eslint/typedef
        .on('click', (markerEvent): void => {
          const payload: MarkerEvent<PointOfInterestMarkerProperties> = {
            eventType: markerEvent.type,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            markerPosition: new Coordinates(markerEvent.target._latlng.lat, markerEvent.target._latlng.lng),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            markerProperties: markerEvent.target?.feature?.properties as PointOfInterestMarkerProperties
          };
          this.markerChange.emit(payload);
        })
    );
  }

  private readonly featureToMarker = (feature: Feature<Point, PointOfInterestMarkerProperties>, position: LatLng): Layer =>
    this.createEventedMarker(
      position,
      feature,
      this.markersConfigurations[feature.properties.markerType](
        feature as unknown as Feature<Point, MarkerProperties<CnfsByDepartmentProperties & CnfsByRegionProperties>>
      )
    );

  private setView(centerView: CenterView): void {
    this._map.setView({ lat: centerView.coordinates.latitude, lng: centerView.coordinates.longitude }, centerView.zoomLevel, {
      animate: true,
      duration: ANIMATION_DURATION_IN_SECONDS
    });
  }

  public ngAfterViewChecked(): void {
    if (this._map.hasLayer(this._markersLayer)) this._map.removeLayer(this._markersLayer);
    this._markersLayer = geoJSON(this.markers, { pointToLayer: this.featureToMarker });
    this._map.addLayer(this._markersLayer);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    shouldSetView(changes['centerView']) && this.setView(currentValue<CenterView>(changes['centerView']));
  }
}
