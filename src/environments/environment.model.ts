import { EnvironmentType } from './enum/environement';
import { ApiConfiguration } from '../app/tokens';

export enum Api {
  ConseillerNumerique = '@conseillerNumerique',
  AdresseDataGouv = '@adresseDataGouv'
}

export interface EnvironmentModel {
  type: EnvironmentType;
  apisConfiguration: Record<Api, ApiConfiguration>;
}
