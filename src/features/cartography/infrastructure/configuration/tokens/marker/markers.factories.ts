import { DivIcon, icon, Icon, Point as LeafletPoint } from 'leaflet';
import { MarkerProperties } from '../../../presentation/models';
import { Feature, Point } from 'geojson';
import { CnfsByDepartmentProperties, CnfsByRegionProperties } from '../../../../core';

const PIN_CNFS_BASE_64: string =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOC41MiA0OCI+PHBhdGggZD0iTTE0LjI2IDBMMCA4LjIzVjI0LjdMMTMuNSA0OGgxLjUybDEzLjUtMjMuM1Y4LjIzeiIgZmlsbD0iI2UxMDAwZiIvPjxwYXRoIGQ9Ik0xOC4zNCAxNC4xMWg1LjQxdi0zLjEybC05LjQ5LTUuNDctOS40OCA1LjQ3djEwLjk1bDkuNDggNS40OCA5LjQ5LTUuNDh2LTMuMTJoLTUuNDF6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE4LjM0IDE4Ljgydi00LjcxbC00LjA4LTIuMzUtNC4wOCAyLjM1djQuNzFsNC4wOCAyLjM2eiIgZmlsbD0iIzAwMDA5MSIvPjwvc3ZnPg==';

const HALF: number = 0.5;
const ROUND_FALSE: boolean = false;

const CNFS_MARKER_WIDTH_IN_PIXEL: number = 28.5;
const CNFS_MARKER_HEIGTH_IN_PIXEL: number = 48;
const CNFS_MARKER_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_WIDTH_IN_PIXEL,
  CNFS_MARKER_HEIGTH_IN_PIXEL,
  ROUND_FALSE
);

const CNFS_MARKER_CNFS_BY_REGION_WIDTH_IN_PIXEL: number = 72;
const CNFS_MARKER_CNFS_BY_REGION_HEIGTH_IN_PIXEL: number = 72;
const CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_CNFS_BY_REGION_WIDTH_IN_PIXEL,
  CNFS_MARKER_CNFS_BY_REGION_HEIGTH_IN_PIXEL,
  ROUND_FALSE
);

const CNFS_MARKER_CNFS_BY_DEPARTMENT_WIDTH_IN_PIXEL: number = 62;
const CNFS_MARKER_CNFS_BY_DEPARTMENT_HEIGTH_IN_PIXEL: number = 72;
const CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_CNFS_BY_DEPARTMENT_WIDTH_IN_PIXEL,
  CNFS_MARKER_CNFS_BY_DEPARTMENT_HEIGTH_IN_PIXEL,
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
export type DivIconMarkerFactory<T extends CnfsByDepartmentProperties | CnfsByRegionProperties> = (
  feature: Feature<Point, MarkerProperties<T>>
) => DivIcon;

export const cnfsMarkerFactory: IconMarkerFactory = (): Icon =>
  icon({
    iconAnchor: new LeafletPoint(CNFS_MARKER_DIMENSIONS.x * HALF, CNFS_MARKER_DIMENSIONS.y),
    iconSize: CNFS_MARKER_DIMENSIONS,
    iconUrl: PIN_CNFS_BASE_64
  });

export const usagerMarkerFactory: IconMarkerFactory = (): Icon =>
  icon({
    iconAnchor: new LeafletPoint(USAGER_MARKER_DIMENSIONS.x * HALF, USAGER_MARKER_DIMENSIONS.y),
    iconSize: USAGER_MARKER_DIMENSIONS,
    iconUrl: 'assets/map/pin-usager.svg'
  });

export const cnfsByRegionMarkerFactory: DivIconMarkerFactory<CnfsByRegionProperties> = (
  feature: Feature<Point, MarkerProperties<CnfsByRegionProperties>>
): DivIcon =>
  new DivIcon({
    className: '',
    html: `<div class="fr-marker fr-marker--cnfs-by-region">
            <img style="height: 32px; width: 19px" alt="" src="${PIN_CNFS_BASE_64}"/>
            <div class="fr-marker__label">
             ${feature.properties.count}</div>
           </div>`,
    iconAnchor: new LeafletPoint(CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS.x * HALF, CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS.y),
    iconSize: CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS
  });

export const cnfsByDepartmentMarkerFactory: DivIconMarkerFactory<CnfsByDepartmentProperties> = (
  feature: Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>
): DivIcon =>
  new DivIcon({
    className: '',
    html: `<div class="fr-marker fr-marker--cnfs-by-department">
            <img style="height: 32px; width: 19px" alt="" src="${PIN_CNFS_BASE_64}"/>
            <div class="fr-marker__label">
             ${feature.properties.count}</div>
           </div>`,
    iconAnchor: new LeafletPoint(
      CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS.x * HALF,
      CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS.y
    ),
    iconSize: CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS
  });
