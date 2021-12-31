import { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { CnfsProperties } from '../../../../core';
import { CnfsMapDataProperties, MarkerProperties } from './markers.presentation';

const inferMarkerTypeByProperties = ({
  cnfs,
  department,
  region
}: {
  region?: string;
  department?: string;
  cnfs?: CnfsProperties[];
}): Marker => {
  if (cnfs != null) return Marker.CnfsPermanence;
  if (department != null) return Marker.CnfsByDepartment;
  if (region != null) return Marker.CnfsByRegion;

  return Marker.Usager;
};

export const setmarkerTypeByInference = (
  positionFeature: Feature<Point, CnfsMapDataProperties>
): Feature<Point, MarkerProperties<CnfsMapDataProperties>> => ({
  geometry: { ...positionFeature.geometry },
  properties: {
    ...positionFeature.properties,
    markerType: inferMarkerTypeByProperties(positionFeature.properties)
  },
  type: 'Feature'
});

export const mapPointsOfInterestToTypedMarkers = (
  visiblePointsOfInterest: FeatureCollection<Point, CnfsMapDataProperties>
): FeatureCollection<Point, MarkerProperties<CnfsMapDataProperties>> => ({
  features: visiblePointsOfInterest.features.map(setmarkerTypeByInference),
  type: 'FeatureCollection'
});
