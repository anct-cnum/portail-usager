import { EnvironmentType } from './enum/environement';
import { Api, EnvironmentModel } from './environment.model';

// TODO Passer en var d'env
export const ENVIRONMENT: EnvironmentModel = {
  apisConfiguration: {
    [Api.Adresse]: { domain: 'https://api-adresse.data.gouv.fr' },
    [Api.ConseillerNumerique]: { domain: 'https://api.conseiller-numerique.gouv.fr' }
  },
  type: EnvironmentType.Development
};
