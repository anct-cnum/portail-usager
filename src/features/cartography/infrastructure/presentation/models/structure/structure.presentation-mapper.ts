import { StructurePresentation } from './structure.presentation';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceProperties } from '../cnfs-permanence';
import { MarkerProperties, PointOfInterestMarkers } from '../markers';

export const cnfsPermanencesToStructurePresentations = (
  cnfsPermanences: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
): StructurePresentation[] =>
  cnfsPermanences.map(
    // TODO Je ne trouve pas la syntaxe pour typer
    // eslint-disable-next-line @typescript-eslint/typedef
    ({ properties: { structure } }: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>): StructurePresentation => ({
      address: structure.address,
      isLabeledFranceServices: structure.isLabeledFranceServices,
      name: structure.name,
      phone: structure.phone,
      type: structure.type
    })
  );
