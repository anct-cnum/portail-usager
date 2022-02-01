import { DivIcon, icon, Icon, Point as LeafletPoint } from 'leaflet';
import { CnfsPermanenceMarkerProperties, MarkerProperties } from '../../../presentation/models';
import { CnfsByDepartmentProperties, CnfsByRegionProperties } from '../../../../core';
import { MarkerFactory } from './markers.configuration';

const PIN_CNFS_BASE_64: string =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOC41MiA0OCI+PHBhdGggZD0iTTE0LjI2IDBMMCA4LjIzVjI0LjdMMTMuNSA0OGgxLjUybDEzLjUtMjMuM1Y4LjIzeiIgZmlsbD0iI2UxMDAwZiIvPjxwYXRoIGQ9Ik0xOC4zNCAxNC4xMWg1LjQxdi0zLjEybC05LjQ5LTUuNDctOS40OCA1LjQ3djEwLjk1bDkuNDggNS40OCA5LjQ5LTUuNDh2LTMuMTJoLTUuNDF6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE4LjM0IDE4Ljgydi00LjcxbC00LjA4LTIuMzUtNC4wOCAyLjM1djQuNzFsNC4wOCAyLjM2eiIgZmlsbD0iIzAwMDA5MSIvPjwvc3ZnPg==';

const HALF: number = 0.5;
const ROUND_FALSE: boolean = false;

const CNFS_MARKER_WIDTH_IN_PIXEL: number = 28.5;
const CNS_MARKER_HEIGHT_IN_PIXEL: number = 48;
const CNFS_MARKER_HIGHLIGHT_SCALE: number = 1.5;
const CNFS_MARKER_HIGHLIGHT_WIDTH_IN_PIXEL: number = CNFS_MARKER_WIDTH_IN_PIXEL * CNFS_MARKER_HIGHLIGHT_SCALE;
const CNFS_MARKER_HIGHLIGHT_HEIGTH_IN_PIXEL: number = CNS_MARKER_HEIGHT_IN_PIXEL * CNFS_MARKER_HIGHLIGHT_SCALE;
const CNFS_MARKER_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_WIDTH_IN_PIXEL,
  CNS_MARKER_HEIGHT_IN_PIXEL,
  ROUND_FALSE
);
const CNFS_MARKER_HIGHLIGHT_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_HIGHLIGHT_WIDTH_IN_PIXEL,
  CNFS_MARKER_HIGHLIGHT_HEIGTH_IN_PIXEL,
  ROUND_FALSE
);

const CNFS_MARKER_CNFS_BY_REGION_WIDTH_IN_PIXEL: number = 72;
const CNS_MARKER_CNS_BY_REGION_HEIGHT_IN_PIXEL: number = 72;
const CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_CNFS_BY_REGION_WIDTH_IN_PIXEL,
  CNS_MARKER_CNS_BY_REGION_HEIGHT_IN_PIXEL,
  ROUND_FALSE
);

const CNFS_MARKER_CNFS_BY_DEPARTMENT_WIDTH_IN_PIXEL: number = 62;
const CNS_MARKER_CNS_BY_DEPARTMENT_HEIGHT_IN_PIXEL: number = 72;
const CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS: LeafletPoint = new LeafletPoint(
  CNFS_MARKER_CNFS_BY_DEPARTMENT_WIDTH_IN_PIXEL,
  CNS_MARKER_CNS_BY_DEPARTMENT_HEIGHT_IN_PIXEL,
  ROUND_FALSE
);

const USAGER_MARKER_WIDTH_IN_PIXEL: number = 16;
const USAGER_MARKER_HEIGHT_IN_PIXEL: number = 16;
const USAGER_MARKER_DIMENSIONS: LeafletPoint = new LeafletPoint(
  USAGER_MARKER_WIDTH_IN_PIXEL,
  USAGER_MARKER_HEIGHT_IN_PIXEL,
  ROUND_FALSE
);

export type IconMarkerFactory<T = null> = MarkerFactory<T, Icon>;

export type DivIconMarkerFactory<T> = MarkerFactory<T, DivIcon>;

export const cnfsMarkerFactory: IconMarkerFactory<CnfsPermanenceMarkerProperties> = (
  properties: MarkerProperties<CnfsPermanenceMarkerProperties>
): Icon => {
  const cnfsMarkerDimensions: LeafletPoint =
    properties.highlight === true ? CNFS_MARKER_HIGHLIGHT_DIMENSIONS : CNFS_MARKER_DIMENSIONS;
  return icon({
    iconAnchor: new LeafletPoint(cnfsMarkerDimensions.x * HALF, cnfsMarkerDimensions.y),
    iconSize: cnfsMarkerDimensions,
    iconUrl: PIN_CNFS_BASE_64,
    popupAnchor: [0, -CNFS_MARKER_HIGHLIGHT_DIMENSIONS.y]
  });
};

export const usagerMarkerFactory: IconMarkerFactory = (): Icon =>
  icon({
    iconAnchor: new LeafletPoint(USAGER_MARKER_DIMENSIONS.x * HALF, USAGER_MARKER_DIMENSIONS.y),
    iconSize: USAGER_MARKER_DIMENSIONS,
    iconUrl: 'assets/map/pin-usager.svg'
  });

const cnfsByRegionMarkerHtmlTemplate = (properties: MarkerProperties<CnfsByRegionProperties>): string => `
<div class="fr-marker fr-marker--cnfs-by-region">
  <img style="height: 32px; width: 19px" alt="" src="${PIN_CNFS_BASE_64}"/>
  <div class="fr-marker__label">
    ${properties.count}
  </div>
</div>`;

export const cnfsByRegionMarkerFactory: DivIconMarkerFactory<CnfsByRegionProperties> = (
  properties: MarkerProperties<CnfsByRegionProperties>
): DivIcon =>
  new DivIcon({
    className: '',
    html: cnfsByRegionMarkerHtmlTemplate(properties),
    iconAnchor: new LeafletPoint(CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS.x * HALF, CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS.y),
    iconSize: CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS,
    popupAnchor: [0, -CNFS_MARKER_CNFS_BY_REGION_DIMENSIONS.y]
  });

const cnfsByDepartmentMarkerHtmlTemplate = (properties: CnfsByDepartmentProperties): string => `
  <div class="fr-marker fr-marker--cnfs-by-department">
    <img style="height: 32px; width: 19px" alt="" src="${PIN_CNFS_BASE_64}"/>
    <div class="fr-marker__label">
      ${properties.count}
    </div>
  </div>`;

export const cnfsByDepartmentMarkerFactory: DivIconMarkerFactory<CnfsByDepartmentProperties> = (
  properties: MarkerProperties<CnfsByDepartmentProperties>
): DivIcon =>
  new DivIcon({
    className: '',
    html: cnfsByDepartmentMarkerHtmlTemplate(properties),
    iconAnchor: new LeafletPoint(
      CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS.x * HALF,
      CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS.y
    ),
    iconSize: CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS,
    popupAnchor: [0, -CNFS_MARKER_CNFS_BY_DEPARTMENT_DIMENSIONS.y]
  });
