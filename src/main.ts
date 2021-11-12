/* eslint-disable no-console */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ENVIRONMENT, EnvironmentType } from './environments';

if (ENVIRONMENT.type === EnvironmentType.Production)
  enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((bootstrapModuleError: Error): void =>
    console.error(bootstrapModuleError)
  );
