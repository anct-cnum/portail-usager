import { AddressFound } from '../../../../core';
import { Geometry } from 'geojson';

interface AddressFoundTransferFeature {
  type: 'Feature';
  geometry: Geometry;
  properties: {
    label: string;
    score: number;
    id: string;
    type: string;
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    population: number;
    city: string;
    context: string;
    importance: number;
  };
}

export interface AddressFoundTransfer {
  type: 'FeatureCollection';
  version: 'draft';
  features: AddressFoundTransferFeature[];
  attribution: 'BAN';
  licence: 'ETALAB-2.0';
  query: string;
  limit: number;
}

export const addressFoundTransferToCore = (addressesFoundTransfer: AddressFoundTransfer): AddressFound[] =>
  addressesFoundTransfer.features.map(
    (addressFoundTransferFeature: AddressFoundTransferFeature): AddressFound => ({
      context: addressFoundTransferFeature.properties.context,
      label: addressFoundTransferFeature.properties.label
    })
  );
