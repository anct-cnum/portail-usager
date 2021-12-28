import { MarkerProperties, MarkersPresentation } from '../cnfs';
import { CnfsMapProperties, CnfsProperties } from '../../../../../../environments/environment.model';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';

const inferMarkerTypeByProperties = ({
  cnfs,
  department,
  region
}: {
  region?: string;
  department?: string;
  cnfs?: CnfsProperties[];
}): Marker => {
  if (cnfs != null) return Marker.Cnfs;

  // TODO Remplacer par departement quand branche geoByDeps sera mergée.
  if (department != null) return Marker.CnfsCluster;
  if (region != null) return Marker.CnfsByRegion;

  return Marker.Usager;
};

export const setMarkerIconByInference = (
  positionFeature: Feature<Point, CnfsMapProperties>
): Feature<Point, MarkerProperties> => ({
  geometry: { ...positionFeature.geometry },
  properties: {
    ...positionFeature.properties,
    markerIconConfiguration: inferMarkerTypeByProperties(positionFeature.properties)
  },
  type: 'Feature'
});

export const mapPositionsToMarkers = (visiblePositions: FeatureCollection<Point, CnfsMapProperties>): MarkersPresentation => ({
  features: visiblePositions.features.map(setMarkerIconByInference),
  type: 'FeatureCollection'
});
