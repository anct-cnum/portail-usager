import type { EnvironmentType } from './enum/environement';
import type { ApiConfiguration } from '../app/tokens';

export enum Api {
  Adresse = '@adresse',
  ConseillerNumerique = '@conseillerNumerique'
}

export interface EnvironmentModel {
  type: EnvironmentType;
  apisConfiguration: Record<Api, ApiConfiguration>;
}
