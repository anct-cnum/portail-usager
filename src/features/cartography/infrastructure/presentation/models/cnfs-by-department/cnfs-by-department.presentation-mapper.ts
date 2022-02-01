import { Feature, Point } from 'geojson';
import { CnfsByDepartment, CnfsByDepartmentProperties } from '../../../../core';
import { MarkerProperties } from '../markers';
import { MarkerKey } from '../../../configuration';

const coreToPresentationMarkerProperties = ({
  properties
}: CnfsByDepartment): MarkerProperties<CnfsByDepartmentProperties> => ({
  ...properties,
  markerType: MarkerKey.CnfsByDepartment
});

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
