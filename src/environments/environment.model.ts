import { EnvironmentType } from './enum/environement';
import { ApiConfiguration } from '../app/tokens';

export enum Api {
  Adresse = '@adresse',
  Geo = '@geo',
  ConseillerNumerique = '@conseillerNumerique'
}

export interface EnvironmentModel {
  type: EnvironmentType;
  apisConfiguration: Record<Api, ApiConfiguration>;
}

/*
 * TODO Refactor with even stricter types once the contracts are more defined ?
 *  eg: (export type ConseillerNumeriqueProperties = { [name: string]: string | number | ConseillerProperties | StructureProperties; })
 */

/*
 * For now forbid the null value. (GeoJsonProperty = { [name: string]: any };)
 * GeoJsonProperty from geojson package is GeoJsonProperty = { [name: string]: any } | null;
 */
export type AnyGeoJsonProperty = Record<string, unknown>;
