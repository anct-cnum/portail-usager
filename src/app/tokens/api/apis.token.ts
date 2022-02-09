import { InjectionToken } from '@angular/core';
import { ApiConfiguration } from './api.configuration';
import { Api } from '../../../environments';

export const APIS_TOKENS: InjectionToken<Record<Api, ApiConfiguration>> = new InjectionToken<Record<Api, ApiConfiguration>>(
  'apis.configuration'
);
