import { StructurePresentation } from './structure.presentation';
import {
  CnfsMapProperties, CnfsPermanenceProperties,
  StructureProperties
} from "../../../../../../environments/environment.model";
import { Feature, FeatureCollection, Point } from 'geojson';

export const mapPositionsToStructurePresentationArray = (
  visiblePositions: FeatureCollection<Point, CnfsMapProperties>
): StructurePresentation[] =>
  visiblePositions.features.map((feature: Feature<Point, CnfsMapProperties>): StructurePresentation => {
    const { structure }: { structure: StructureProperties } = (feature as Feature<Point, CnfsPermanenceProperties>).properties;
    return {
      address: structure.address,
      isLabeledFranceServices: structure.isLabeledFranceServices,
      name: structure.name,
      phone: structure.phone,
      type: structure.type
    };
  });
