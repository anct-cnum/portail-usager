import { EnvironmentType } from './enum/environement';
import { Api, EnvironmentModel } from './models/environment.model';

export const ENVIRONMENT: EnvironmentModel = {
  apisConfiguration: {
    [Api.AdresseDataGouv]: { domain: 'https://api-adresse.data.gouv.fr' },
    [Api.ConseillerNumerique]: { domain: 'https://api.conseiller-numerique.gouv.fr' }
  },
  type: EnvironmentType.Production
};
