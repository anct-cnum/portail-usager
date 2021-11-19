import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ENVIRONMENT, EnvironmentType } from '../../environments';
import { AppRoutingModule } from './app-routing.module';
import { RootLayout } from '../pages/layouts/root.layout';

@NgModule({
  bootstrap: [RootLayout],
  declarations: [RootLayout],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: ENVIRONMENT.type === EnvironmentType.Production
    })
  ],
  providers: []
})
export class AppModule {}
