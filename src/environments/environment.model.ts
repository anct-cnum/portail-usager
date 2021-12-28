import { EnvironmentType } from './enum/environement';
import { ApiConfiguration } from '../app/tokens';

export enum Api {
  Adresse = '@adresse',
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

export interface CnfsProperties {
  [key: string]: any;
  // email: string;
  // name: string;
  // horaires: string;
}

export interface StructureProperties {
  address: string;
  isLabeledFranceServices: boolean;
  name: string;
  phone: string;
}

export interface CnfsPermanenceProperties {
  cnfs: CnfsProperties;
  structure: StructureProperties;
}

export interface CnfsByRegionProperties {
  boundingZoom: number;
  count: number;
  region: string;
}

export interface CnfsByDepartmentProperties {
  boundingZoom: number;
  count: number;
  department: string;
}

export type CnfsMapProperties = CnfsByDepartmentProperties | CnfsByRegionProperties | CnfsPermanenceProperties;
