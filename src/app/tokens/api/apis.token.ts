import { InjectionToken } from '@angular/core';
import type { ApiConfiguration } from './api.configuration';
import type { Api } from '../../../environments/environment.model';

export const APIS_TOKENS: InjectionToken<Record<Api, ApiConfiguration>> = new InjectionToken<Record<Api, ApiConfiguration>>(
  'apis.configuration'
);
