import { InjectionToken } from '@angular/core';
import { CartographyConfiguration } from './cartography.configuration';

export const CARTOGRAPHY_TOKEN: InjectionToken<CartographyConfiguration> = new InjectionToken<CartographyConfiguration>(
  'cartography.configuration'
);
