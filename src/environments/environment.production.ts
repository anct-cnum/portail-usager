import { EnvironmentType } from './enum/environement';
import { Api, EnvironmentModel } from './environment.model';

// TODO Passer en var d'env
export const ENVIRONMENT: EnvironmentModel = {
  apisConfiguration: {
    // Todo: remove before production (really need to set up environment variable to handle this case...)
    [Api.ConseillerNumerique]: { domain: 'https://beta.api.conseiller-numerique.gouv.fr' }
  },
  type: EnvironmentType.Production
};
