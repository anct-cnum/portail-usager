import { EnvironmentType } from './enum/environement';
import { ApiConfiguration } from '../app/tokens';

export enum Api {
  Adresse = '@adresse',
  Geo = '@geo',
  AdresseFallback = '@adresseFallback',
  ConseillerNumerique = '@conseillerNumerique'
}

export interface EnvironmentModel {
  type: EnvironmentType;
  apisConfiguration: Record<Api, ApiConfiguration>;
}
