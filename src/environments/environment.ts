import { EnvironmentType } from './enum/environement';
import type { EnvironmentModel } from './environment.model';
import { Api } from './environment.model';

export const ENVIRONMENT: EnvironmentModel = {
  apisConfiguration: {
    [Api.Adresse]: { domain: 'https://api-adresse.data.gouv.fr' },
    [Api.ConseillerNumerique]: { domain: 'https://beta.api.conseiller-numerique.gouv.fr' }
  },
  type: EnvironmentType.Development
};
