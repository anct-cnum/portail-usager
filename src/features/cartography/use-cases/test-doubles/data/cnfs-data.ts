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
          name: 'Smiles'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0.2331873568459, 45.71506898886124]
        },
        properties: {
          name: 'Apsalar'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0.0331873568459, 47.71506898886124]
        },
        properties: {
          name: 'Crokus'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0.42331873568459, 45.71506898886124]
        },
        properties: {
          name: 'Quick Ben'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [3.0331873568459, 50.71506898886124]
        },
        properties: {
          name: 'Rhulad'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [2.0331873568459, 47.71506898886124]
        },
        properties: {
          name: 'Karsa'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [3.0331873568459, 47.71506898886124]
        },
        properties: {
          name: 'Menandore'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [4.0331873568459, 43.71506898886124]
        },
        properties: {
          name: 'Whiskyjack'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [5.0331873568459, 47.71506898886124]
        },
        properties: {
          name: 'Fiddler'
        }
      }
    ]
  };
}
