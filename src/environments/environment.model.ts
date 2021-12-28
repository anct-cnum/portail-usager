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

export interface CnfsTransferProperties {
  conseiller: {
    name: string;
    email: string;
  };
  structure: {
    name?: string;
    isLabeledFranceServices?: boolean;
    address?: string;
    phone?: string;
    type?: string;
  };
}

export interface CnfsProperties {
  email: string;
  name: string;
}

export interface StructureProperties {
  address: string;
  isLabeledFranceServices: boolean;
  name: string;
  phone: string;
  type: string;
}

export interface CnfsPermanenceProperties {
  cnfs: CnfsProperties[];
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
