import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { CnfsByRegionProperties, CnfsProperties } from '../../../../core';
import { MarkerProperties } from './markers.presentation';

const inferMarkerTypeByProperties = ({
  cnfs,
  region
}: {
  region?: string;
  department?: string;
  cnfs?: CnfsProperties[];
}): Marker => {
  if (cnfs != null) return Marker.Cnfs;

  if (region != null) return Marker.CnfsByRegion;

  return Marker.Usager;
};

export const setMarkerIconByInference = (
  positionFeature: Feature<Point, CnfsByRegionProperties | CnfsPermanenceProperties>
): Feature<Point, MarkerProperties<CnfsByRegionProperties | CnfsPermanenceProperties>> => ({
  geometry: { ...positionFeature.geometry },
  properties: {
    ...positionFeature.properties,
    markerIconConfiguration: inferMarkerTypeByProperties(positionFeature.properties)
  },
  type: 'Feature'
});

export const mapPositionsToMarkers = (
  visiblePositions: FeatureCollection<Point, CnfsByRegionProperties | CnfsPermanenceProperties>
): FeatureCollection<Point, MarkerProperties<CnfsByRegionProperties | CnfsPermanenceProperties>> => ({
  features: visiblePositions.features.map(setMarkerIconByInference),
  type: 'FeatureCollection'
});
