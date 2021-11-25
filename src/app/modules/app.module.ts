import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ENVIRONMENT, EnvironmentType } from '../../environments';
import { AppRoutingModule } from './app-routing.module';
import { RootLayout } from '../pages/layouts/root/root.layout';
import { ContentLayout } from '../pages/layouts/content/content.layout';
import { HomePage } from '../pages/home/home.page';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiRewriteUrlInterceptor } from '../interceptors/api-rewrite-url.interceptor';

import { APIS_TOKENS } from '../tokens';

@NgModule({
  bootstrap: [RootLayout],
  declarations: [ContentLayout, HomePage, RootLayout],
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
