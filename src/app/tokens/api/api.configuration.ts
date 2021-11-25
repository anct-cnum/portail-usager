export interface ApiConfiguration {
  /**
   * Api base domain
   * eg: https://api-adresse.data.gouv.fr/
   */
  domain: string;
  /**
   * Api prefix.
   * eg: /api/v1/
   */
  prefix?: string;
}
