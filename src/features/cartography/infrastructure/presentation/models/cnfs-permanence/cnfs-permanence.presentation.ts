import { CnfsPermanence } from '../../../../core';
import { MarkerHighLight } from '../markers';

export type CnfsPermanenceProperties = CnfsPermanence & {
  highlight?: MarkerHighLight;
};
