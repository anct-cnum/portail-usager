import { Control, control, map, Map as LeafletMap, TileLayer, tileLayer, ZoomPanOptions } from 'leaflet';
import { CenterView } from '../../models';

const TILE_LAYER_TEMPLATE: string = 'https://{s}.basemaps.cartocdn.com/{id}/{z}/{x}/{y}.png';

const ATTRIBUTION: string = '&copy; <a href="https://carto.com/attributions">CARTO</a>';

const DEFAULT_CENTER_LATITUDE: number = 46.28146057911664;

const DEFAULT_CENTER_LONGITUDE: number = 4.468874066180609;

const DEFAULT_ZOOM: number = 6;

const DEFAULT_VIEW: CenterView = {
  coordinates: {
    latitude: DEFAULT_CENTER_LATITUDE,
    longitude: DEFAULT_CENTER_LONGITUDE
  },
  zoomLevel: DEFAULT_ZOOM
};

const MAX_ZOOM: number = 18;

const MIN_ZOOM: number = 2.5;

const TILES_ID: string = 'rastertiles/voyager_labels_under';

const ZOOM_OPTIONS: Control.ZoomOptions = { position: 'bottomright' };

const ANIMATION_DURATION_IN_SECONDS: number = 0.2;

const setTileLayer = (leafletMap: LeafletMap): TileLayer =>
  tileLayer(TILE_LAYER_TEMPLATE, {
    attribution: ATTRIBUTION,
    id: TILES_ID,
    maxZoom: MAX_ZOOM,
    minZoom: MIN_ZOOM
  }).addTo(leafletMap);

const withAnimation = (animate: boolean): ZoomPanOptions =>
  animate
    ? {
        animate: true,
        duration: ANIMATION_DURATION_IN_SECONDS
      }
    : {};

export const setView = (
  leafletMap: LeafletMap,
  centerView: CenterView = DEFAULT_VIEW,
  isAnimated: boolean = true
): LeafletMap =>
  leafletMap.setView(
    {
      lat: centerView.coordinates.latitude,
      lng: centerView.coordinates.longitude
    },
    centerView.zoomLevel,
    { ...withAnimation(isAnimated) }
  );

const setMapInContainer = (mapContainerElement: HTMLElement): LeafletMap =>
  setView(map(mapContainerElement, { zoomControl: false }), DEFAULT_VIEW, false);

const updateOnResize = (leafletMap: LeafletMap, mapContainerElement: HTMLElement): void => {
  new ResizeObserver((): LeafletMap => leafletMap.invalidateSize()).observe(mapContainerElement);
};

export const initializeMap = (mapContainerElement: HTMLElement): LeafletMap => {
  const leafletMap: LeafletMap = setMapInContainer(mapContainerElement);
  setTileLayer(leafletMap);
  control.zoom(ZOOM_OPTIONS).addTo(leafletMap);
  updateOnResize(leafletMap, mapContainerElement);
  return leafletMap;
};
