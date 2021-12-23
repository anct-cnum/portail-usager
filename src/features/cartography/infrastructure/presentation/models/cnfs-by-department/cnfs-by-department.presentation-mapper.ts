import { Feature, Point } from 'geojson';
import { CnfsByDepartment, CnfsByDepartmentProperties } from '../../../../core';
import { MarkerProperties } from '../markers';
import { Marker } from '../../../configuration';

function coreToPresentationMarkerProperties({ properties }: CnfsByDepartment): MarkerProperties<CnfsByDepartmentProperties> {
  return {
    ...properties,
    markerType: Marker.CnfsByDepartment
  };
}

export const cnfsByDepartmentToPresentation = (
  cnfsByDepartments: CnfsByDepartment[]
): Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[] =>
  cnfsByDepartments.map(
    (cnfsByDepartment: CnfsByDepartment): Feature<Point, MarkerProperties<CnfsByDepartmentProperties>> => ({
      geometry: {
        coordinates: [cnfsByDepartment.position.longitude, cnfsByDepartment.position.latitude],
        type: 'Point'
      },
      properties: coreToPresentationMarkerProperties(cnfsByDepartment),
      type: 'Feature'
    })
  );
