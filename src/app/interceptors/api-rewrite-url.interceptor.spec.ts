import { HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiRewriteUrlInterceptor } from './api-rewrite-url.interceptor';
import { APIS_TOKENS } from '../tokens';
import { Api } from '../../environments/environment.model';

const HTTP_REQUEST_NO_REWRITE: HttpRequest<void> = new HttpRequest<void>('GET', 'https://www.google.com');

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
            [Api.ConseillerNumerique]: { domain: 'https://api.conseiller-numerique.gouv.fr' }
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
});
