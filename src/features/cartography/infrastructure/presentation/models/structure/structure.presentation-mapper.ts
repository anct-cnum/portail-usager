import { StructurePresentation } from './structure.presentation';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { MarkerProperties } from '../markers';

export const cnfsPermanencesToStructurePresentations = (
  cnfsPermanences: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
): StructurePresentation[] =>
  cnfsPermanences.map(
    (cnfsPermanence: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>): StructurePresentation => ({
      address: cnfsPermanence.properties.address,
      id: cnfsPermanence.properties.id,
      isLabeledFranceServices: cnfsPermanence.properties.isLabeledFranceServices,
      name: cnfsPermanence.properties.name
    })
  );
