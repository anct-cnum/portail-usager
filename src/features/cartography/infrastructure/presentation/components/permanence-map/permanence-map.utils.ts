import { ViewportAndZoom } from '../../directives';
import { MarkerKey } from '../../../configuration';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { Feature, FeatureCollection, Point } from 'geojson';

export type MapChange = [ViewportAndZoom, boolean];

export const markerTypeToDisplayAtZoomLevel = (zoomLevel: number): MarkerKey => {
  if (zoomLevel > DEPARTMENT_ZOOM_LEVEL) return MarkerKey.CnfsPermanence;
  if (zoomLevel > REGION_ZOOM_LEVEL) return MarkerKey.CnfsByDepartment;
  return MarkerKey.CnfsByRegion;
};

export const getMarkerToDisplay = (forceCnfsPermanenceDisplay: boolean, viewportWithZoomLevel: ViewportAndZoom): MarkerKey =>
  forceCnfsPermanenceDisplay ? MarkerKey.CnfsPermanence : markerTypeToDisplayAtZoomLevel(viewportWithZoomLevel.zoomLevel);

export const toFeatureCollection = <T>(features: Feature<Point, T>[]): FeatureCollection<Point, T> => ({
  features,
  type: 'FeatureCollection'
});
