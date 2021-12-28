import { MarkerProperties, MarkersPresentation } from '../cnfs';
import { CnfsMapProperties, CnfsProperties } from '../../../../../../environments/environment.model';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';

const inferMarkerByProperties = ({
  cnfs,
  department,
  region
}: {
  region?: string;
  department?: string;
  cnfs?: CnfsProperties;
}): Marker => {
  if (cnfs != null) return Marker.Cnfs;

  // TODO Remplacer par departement quand branche geoByDeps sera mergée.
  if (department != null) return Marker.CnfsCluster;
  if (region != null) return Marker.CnfsByRegion;

  return Marker.Usager;
};

export const setMarkerIconByTypeInference = (
  positionFeature: Feature<Point, CnfsMapProperties>
): Feature<Point, MarkerProperties> => ({
  geometry: { ...positionFeature.geometry },
  properties: {
    ...positionFeature.properties,
    markerIconConfiguration: inferMarkerByProperties(positionFeature.properties)
  },
  type: 'Feature'
});

export const mapPositionsToMarkers = (visiblePositions: FeatureCollection<Point, CnfsMapProperties>): MarkersPresentation => ({
  features: visiblePositions.features.map(setMarkerIconByTypeInference),
  type: 'FeatureCollection'
});

/*
 *
 *Export const mergeProperties = (
 *  properties: AnyGeoJsonProperty,
 *  marker: Marker
 *): AnyGeoJsonProperty & { markerIconConfiguration: Marker } => ({
 *  ...properties,
 *  ...{ markerIconConfiguration: properties['cluster'] === true ? marker : Marker.Cnfs }
 *});
 *
 *export const setMarkerIcon =
 *  (marker: Marker): ((feature: Feature<Point, AnyGeoJsonProperty>) => Feature<Point, MarkerProperties>) =>
 *    (feature: Feature<Point, AnyGeoJsonProperty>): Feature<Point, MarkerProperties> => ({
 *      ...feature,
 *      ...{ properties: mergeProperties(feature.properties, marker) }
 *    });
 */
