import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfiguration, APIS_TOKENS } from '../tokens';
import { NotInAvailableApisError } from './errors';
import { Api } from '../../environments';

@Injectable()
export class ApiRewriteUrlInterceptor<TResult> implements HttpInterceptor {
  public constructor(@Inject(APIS_TOKENS) private readonly apisTokens: Record<Api, ApiConfiguration>) {}

  private fullUrlFromConfiguration(apiConfiguration: ApiConfiguration, pathInfo: string = ''): string {
    const prefix: string = apiConfiguration.prefix == null ? '' : `/${apiConfiguration.prefix}`;

    return `${apiConfiguration.domain}${prefix}/${pathInfo}`;
  }

  private guardIsAvailableApi(apiUrlKey: string = ''): Api {
    const apiKey: Api = apiUrlKey as unknown as Api;
    if (!Object.values(Api).includes(apiKey)) throw new NotInAvailableApisError(apiUrlKey);

    return apiKey;
  }

  private needRewrite(requestedUrl: string): boolean {
    return requestedUrl.startsWith('@');
  }

  private rewriteUrl(requestedUrl: string): string {
    const captureUrlGroups: RegExp = /(?<apiUrlKey>.*?)\/(?<pathInfo>.+)/u;
    const capturedGroups: RegExpExecArray | null = captureUrlGroups.exec(requestedUrl);
    const apiKey: Api = this.guardIsAvailableApi(capturedGroups?.groups?.['apiUrlKey']);

    return this.fullUrlFromConfiguration(this.apisTokens[apiKey], capturedGroups?.groups?.['pathInfo']);
  }

  public intercept(request: HttpRequest<TResult>, next: HttpHandler): Observable<HttpEvent<TResult>> {
    return this.needRewrite(request.url)
      ? next.handle(request.clone({ url: this.rewriteUrl(request.url) }))
      : next.handle(request);
  }
}
