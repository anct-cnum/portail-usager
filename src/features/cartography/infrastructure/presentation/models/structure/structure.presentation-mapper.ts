import { StructurePresentation } from './structure.presentation';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceMarkerProperties } from '../markers';
import { Coordinates } from '../../../../core';

export const cnfsPermanencesToStructurePresentations = (
  cnfsPermanences: Feature<Point, CnfsPermanenceMarkerProperties>[]
): StructurePresentation[] =>
  cnfsPermanences.map(
    (feature: Feature<Point, CnfsPermanenceMarkerProperties>): StructurePresentation => ({
      address: feature.properties.address,
      id: feature.properties.id,
      isLabeledFranceServices: feature.properties.isLabeledFranceServices,
      location: Coordinates.fromGeoJsonFeature(feature),
      name: feature.properties.name
    })
  );
