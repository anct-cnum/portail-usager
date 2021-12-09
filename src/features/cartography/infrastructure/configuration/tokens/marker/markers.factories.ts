import { DivIcon, icon, Icon, Point as LeafletPoint } from 'leaflet';
import { MarkerProperties } from '../../../presentation/models';
import { Feature, Point } from 'geojson';

const HALF: number = 0.5;
const ROUND_FALSE: boolean = false;

const CNFS_MARKER_WIDTH_IN_PIXEL: number = 28.5;
const CNFS_MARKER_HEIGTH_IN_PIXEL: number = 48;
const CNFS_MARKER_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_WIDTH_IN_PIXEL,
  CNFS_MARKER_HEIGTH_IN_PIXEL,
  ROUND_FALSE
);

const CNFS_MARKER_CLUSTER_WIDTH_IN_PIXEL: number = 31;
const CNFS_MARKER_CLUSTER_HEIGTH_IN_PIXEL: number = 36;
const CNFS_MARKER_CLUSTER_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_CLUSTER_WIDTH_IN_PIXEL,
  CNFS_MARKER_CLUSTER_HEIGTH_IN_PIXEL,
  ROUND_FALSE
);

const USAGER_MARKER_WIDTH_IN_PIXEL: number = 16;
const USAGER_MARKER_HEIGTH_IN_PIXEL: number = 16;
const USAGER_MARKER_DIMENSIONS: LeafletPoint = new LeafletPoint(
  USAGER_MARKER_WIDTH_IN_PIXEL,
  USAGER_MARKER_HEIGTH_IN_PIXEL,
  ROUND_FALSE
);

export type IconMarkerFactory = () => Icon;
export type DivIconMarkerFactory = (feature: Feature<Point, MarkerProperties>) => DivIcon;

export const cnfsMarkerFactory: IconMarkerFactory = (): Icon =>
  icon({
    iconAnchor: new LeafletPoint(CNFS_MARKER_DIMENSIONS.x * HALF, CNFS_MARKER_DIMENSIONS.y),
    iconSize: CNFS_MARKER_DIMENSIONS,
    iconUrl: 'assets/map/pin-cnfs.svg'
  });

// eslint-disable-next-line max-lines-per-function
export const cnfsClusterMarkerFactory: DivIconMarkerFactory = (feature: Feature<Point, MarkerProperties>): DivIcon =>
  new DivIcon({
    className: '',
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    html: `<div
        style="width: 31px;
               height: 36px;
               font-family: Marianne, sans-serif;
               font-weight: 600;
               color: #ffff;
               text-align: center;
               background-image: url('./assets/map/pin-cnfs-cluster.svg');
               background-repeat: no-repeat;
               background-position: center;
               background-size: contain;">
      ${feature.properties['point_count_abbreviated'] as number}</div>`,
    iconAnchor: new LeafletPoint(CNFS_MARKER_CLUSTER_DIMENSIONS.x * HALF, CNFS_MARKER_CLUSTER_DIMENSIONS.y),
    iconSize: CNFS_MARKER_CLUSTER_DIMENSIONS
  });

export const usagerMarkerFactory: IconMarkerFactory = (): Icon =>
  icon({
    iconAnchor: new LeafletPoint(USAGER_MARKER_DIMENSIONS.x * HALF, USAGER_MARKER_DIMENSIONS.y),
    iconSize: USAGER_MARKER_DIMENSIONS,
    iconUrl: 'assets/map/pin-usager.svg'
  });
