import { AddressFound } from '../../../../core';

export interface AddressFoundTransfer {
  city: string;
  citycode: string;
  context: string;
  id: string;
  importance: number;
  label: string;
  name: string;
  population: number;
  postcode: string;
  score: number;
  type: string;
  x: number;
  y: number;
}

export const addressFoundTransferToCore = (addressesFoundTransfer: AddressFoundTransfer[]): AddressFound[] =>
  addressesFoundTransfer.map(
    (addressFoundTransfer: AddressFoundTransfer): AddressFound => ({
      context: addressFoundTransfer.context,
      label: addressFoundTransfer.label
    })
  );
