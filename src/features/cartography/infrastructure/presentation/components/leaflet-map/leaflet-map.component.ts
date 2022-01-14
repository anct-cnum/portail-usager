// eslint-disable-next-line id-length
import {
  control,
  DivIcon,
  geoJSON,
  Icon,
  latLng,
  LatLng,
  Layer,
  LeafletMouseEvent,
  map,
  Map as LeafletMap,
  MapOptions as LeafletMapOptions,
  marker,
  Marker as LeafletMarker,
  tileLayer
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
import {
  CenterView,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  TypedMarker
} from '../../models';
import { Marker, MARKERS_TOKEN, MarkersConfiguration } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { emptyFeatureCollection } from '../../helpers';

// TODO Convert configuration to injected token for default options then remove
const ANIMATION_DURATION_IN_SECONDS: number = 0.2;
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
  zoomControl: false
};
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LONGITUDE: number = 4.468874066180609;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_LATITUDE: number = 46.28146057911664;
// TODO Convert configuration to injected token for default options then remove
const DEFAULT_ZOOM_LEVEL: number = 6;

type TypedLeafletMouseEvent<T> = Omit<LeafletMouseEvent, 'target'> & {
  target: {
    feature: T;
  };
};

export type TypedLeafletMarker<T> = Omit<LeafletMarker, 'feature'> & {
  feature: T;
};

const currentValue = <T>(simpleChange: SimpleChange | undefined): T => simpleChange?.currentValue as T;

const shouldSetView = (centerViewChange: SimpleChange | undefined): boolean => !(centerViewChange?.firstChange ?? true);

const toArray = <T>(input: T | T[]): T[] => (Array.isArray(input) ? input : [input]);

const markerPayloadFromEvent = (
  markerEvent: TypedLeafletMouseEvent<Feature<Point, PointOfInterestMarkerProperties>>
): MarkerEvent<PointOfInterestMarkerProperties> => ({
  eventType: markerEvent.type,
  markerPosition: new Coordinates(markerEvent.latlng.lat, markerEvent.latlng.lng),
  markerProperties: markerEvent.target.feature.properties
});

const getMapMarkers = (leafletMap: LeafletMap): LeafletMarker[] => {
  const markers: LeafletMarker[] = [];

  const isLayerWithFeature = (layer: Layer): boolean => Object.keys(layer).includes('feature');

  leafletMap.eachLayer((layer: Layer): number | false => isLayerWithFeature(layer) && markers.push(layer as LeafletMarker));

  return markers;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    new ResizeObserver((): LeafletMap => this._map.invalidateSize()).observe(mapContainer.nativeElement);
  }

  public constructor(@Inject(MARKERS_TOKEN) private readonly markersConfigurations: MarkersConfiguration) {}

  private createEventedMarker(
    position: LatLng,
    feature: Feature<Point, PointOfInterestMarkerProperties>,
    iconMarker: DivIcon | Icon
  ): LeafletMarker {
    return marker(position, {
      icon: iconMarker,
      zIndexOffset: feature.properties.zIndexOffset ?? 0
    }).on('click', (markerEvent: LeafletMouseEvent): void => {
      this.markerChange.emit(markerPayloadFromEvent(markerEvent));
    });
  }

  private readonly featureToMarker = (feature: Feature<Point, PointOfInterestMarkerProperties>, position: LatLng): Layer =>
    this.createEventedMarker(
      position,
      feature,
      this.markersConfigurations[feature.properties.markerType](
        feature as Feature<
          Point,
          MarkerProperties<CnfsByDepartmentProperties & CnfsByRegionProperties & CnfsPermanenceMarkerProperties & null>
        >
      )
    );

  private setView(centerView: CenterView): void {
    this._map.setView({ lat: centerView.coordinates.latitude, lng: centerView.coordinates.longitude }, centerView.zoomLevel, {
      animate: true,
      duration: ANIMATION_DURATION_IN_SECONDS
    });
  }

  public findMarker<T extends Feature<Point, PointOfInterestMarkerProperties>>(
    markerType: Marker | Marker[],
    predicate: (marker: T) => boolean
  ): TypedLeafletMarker<T> | undefined {
    return (getMapMarkers(this._map) as unknown as TypedLeafletMarker<T>[]).find(
      (mapMarker: TypedLeafletMarker<T>): boolean =>
        toArray(markerType).includes(mapMarker.feature.properties.markerType) && predicate(mapMarker.feature)
    );
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
