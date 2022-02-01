import { Feature, Point } from 'geojson';
import { CnfsByRegion, CnfsByRegionProperties } from '../../../../core';
import { MarkerProperties } from '../markers';
import { MarkerKey } from '../../../configuration';

const cnfsByRegionPropertiesToPresentationProperties = ({
  properties
}: CnfsByRegion): MarkerProperties<CnfsByRegionProperties> => ({
  boundingZoom: properties.boundingZoom,
  count: properties.count,
  markerType: MarkerKey.CnfsByRegion,
  region: properties.region
});

export const listCnfsByRegionToPresentation = (
  cnfsByRegions: CnfsByRegion[]
): Feature<Point, MarkerProperties<CnfsByRegionProperties>>[] =>
  cnfsByRegions.map(
    (cnfsByRegion: CnfsByRegion): Feature<Point, MarkerProperties<CnfsByRegionProperties>> => ({
      geometry: {
        coordinates: [cnfsByRegion.position.longitude, cnfsByRegion.position.latitude],
        type: 'Point'
      },
      properties: cnfsByRegionPropertiesToPresentationProperties(cnfsByRegion),
      type: 'Feature'
    })
  );
