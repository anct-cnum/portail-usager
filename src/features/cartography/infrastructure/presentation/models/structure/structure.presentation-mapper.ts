import { StructurePresentation } from './structure.presentation';
import { Feature, FeatureCollection, Point } from 'geojson';
import { CnfsByRegionProperties, StructureProperties } from '../../../../core';
import { CnfsPermanenceProperties } from '../cnfs-permanence';

export const mapPositionsToStructurePresentationArray = (
  visiblePositions: FeatureCollection<Point, CnfsByRegionProperties | CnfsPermanenceProperties>
): StructurePresentation[] =>
  visiblePositions.features.map(
    (feature: Feature<Point, CnfsByRegionProperties | CnfsPermanenceProperties>): StructurePresentation => {
      const { structure }: { structure: StructureProperties } = (feature as Feature<Point, CnfsPermanenceProperties>)
        .properties;
      return {
        address: structure.address,
        isLabeledFranceServices: structure.isLabeledFranceServices,
        name: structure.name,
        phone: structure.phone,
        type: structure.type
      };
    }
  );
