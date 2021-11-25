import type { HttpHandler } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiRewriteUrlInterceptor } from './api-rewrite-url.interceptor';
import { APIS_TOKENS } from '../tokens';
import { Api } from '../../environments/environment.model';

const HTTP_REQUEST_NO_REWRITE: HttpRequest<void> = new HttpRequest<void>('GET', 'https://www.google.com');
const HTTP_REQUEST_SHOULD_REWRITE: HttpRequest<void> = new HttpRequest<void>('GET', '@adresse/search/?q=paris');

// eslint-disable-next-line max-lines-per-function
describe('ApiRewriteUrl Interceptor', (): void => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let apiRewriteUrlInterceptor: ApiRewriteUrlInterceptor<unknown>;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [
        ApiRewriteUrlInterceptor,
        {
          provide: APIS_TOKENS,
          useValue: {
            [Api.Adresse]: { domain: 'https://api-adresse.data.gouv.fr' },
            [Api.ConseillerNumerique]: { domain: 'https://beta.api.conseiller-numerique.gouv.fr' }
          }
        }
      ]
    })
      .compileComponents()
      .catch((): void => {
        throw new Error('ApiRewriteUrlInterceptor');
      });

    apiRewriteUrlInterceptor = TestBed.inject(ApiRewriteUrlInterceptor);
  });

  it('should not rewrite url', (): void => {
    // eslint-disable-next-line rxjs/no-ignored-observable, @typescript-eslint/consistent-type-assertions
    apiRewriteUrlInterceptor.intercept(HTTP_REQUEST_NO_REWRITE, {
      handle: (req: HttpRequest<void>): void => {
        expect(req.url).toBe('https://www.google.com');
      }
    } as HttpHandler);
  });

  it('should rewrite url', (): void => {
    // eslint-disable-next-line rxjs/no-ignored-observable, @typescript-eslint/consistent-type-assertions
    apiRewriteUrlInterceptor.intercept(HTTP_REQUEST_SHOULD_REWRITE, {
      handle: (req: HttpRequest<void>): void => {
        expect(req.url).toBe('https://api-adresse.data.gouv.fr/search/?q=paris');
      }
    } as HttpHandler);
  });
});
