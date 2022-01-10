import { StructurePresentation } from './structure.presentation';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { MarkerProperties, TypedMarker } from '../markers';

export const cnfsPermanencesToStructurePresentations = (
  cnfsPermanences: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
): StructurePresentation[] =>
  cnfsPermanences.map(
    ({ properties }: { properties: CnfsPermanenceProperties & TypedMarker }): StructurePresentation => ({
      address: properties.address,
      id: properties.id,
      isLabeledFranceServices: properties.isLabeledFranceServices,
      name: properties.name
    })
  );
