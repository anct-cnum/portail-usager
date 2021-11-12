import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ENVIRONMENT, EnvironmentType } from '../environments';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
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
