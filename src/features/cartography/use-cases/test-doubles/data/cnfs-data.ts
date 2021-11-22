/* eslint-disable */
import { FeatureCollection } from 'geojson';

export function cnfsData(): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [5.8041670136402, 45.642382872196624]
        },
        properties: {
          name: 'Conseillé 1'
          //Toutes les propriétes à afficher sur la carte...
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0.0331873568459, 45.71506898886124]
        },
        properties: {
          name: 'Conseiller 2'
          //...
        }
      }
    ]
  };
}
