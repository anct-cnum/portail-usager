import { EnvironmentType } from './enum/environement';
import { Api, EnvironmentModel } from './environment.model';

// TODO Passer en var d'env
export const ENVIRONMENT: EnvironmentModel = {
  apisConfiguration: {
    [Api.Adresse]: { domain: 'https://api-adresse.data.gouv.fr' },
    [Api.Geo]: { domain: 'https://geo.api.gouv.fr' },
    /*
     * Todo: Remove beta subdomain when PR https://github.com/anct-cnum/api-conseiller-numerique/pull/650 is merged
     *  /!\ Do not merge into main while beta subdomain is present.
     */
    [Api.ConseillerNumerique]: { domain: 'https://beta.api.conseiller-numerique.gouv.fr' }
  },
  type: EnvironmentType.Production
};
