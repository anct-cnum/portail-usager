import { Cnfs } from '../../../../core';
import { Feature, Point } from 'geojson';
import { CnfsPermanenceProperties } from './cnfs-permanence.presentation';
import { MarkerProperties } from '../markers';
import { Marker } from '../../../configuration';

export const cnfsCoreToCnfsPermanenceFeatures = (cnfs: Cnfs[]): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] =>
  cnfs.map(
    (singleCnfs: Cnfs): Feature<Point, MarkerProperties<CnfsPermanenceProperties>> => ({
      geometry: {
        coordinates: [singleCnfs.position.longitude, singleCnfs.position.latitude],
        type: 'Point'
      },
      properties: {
        markerType: Marker.CnfsPermanence,
        ...singleCnfs.properties
      },
      type: 'Feature'
    })
  );
