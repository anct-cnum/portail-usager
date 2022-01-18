import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ENVIRONMENT, EnvironmentType } from '../../environments';
import { HeaderComponent, MenuComponent } from '../components';
import { ApiRewriteUrlInterceptor } from '../interceptors';
import { ContentLayout, RootLayout } from '../pages';
import { APIS_TOKENS } from '../tokens';
import { AppRoutingModule } from './app-routing.module';
import { SlugifyPipe } from '../pipes';

@NgModule({
  bootstrap: [RootLayout],
  declarations: [ContentLayout, HeaderComponent, MenuComponent, RootLayout, SlugifyPipe],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: ENVIRONMENT.type === EnvironmentType.Production
    })
  ],
  providers: [
    {
      provide: APIS_TOKENS,
      useValue: ENVIRONMENT.apisConfiguration
    },
    { multi: true, provide: HTTP_INTERCEPTORS, useClass: ApiRewriteUrlInterceptor }
  ]
})
export class AppModule {}
