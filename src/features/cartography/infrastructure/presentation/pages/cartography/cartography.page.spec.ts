import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { CartographyPage } from './cartography.page';
import { LeafletMapStubComponent } from '../../test-doubles';
import { FailedToCompileError } from '@angular-common/errors';
import { ListCnfsPositionUseCase } from '../../../../use-cases';
import { CnfsRestTestDouble } from '../../../../use-cases/test-doubles/cnfs-rest-test-double';
import type { CnfsRepository } from '../../../../core';
import { CartographyPresenter } from './cartography.presenter';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class CartographyPresenterStub {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public defaultMapOptions() {
    return {};
  }

  public listCnfsPositions$(): Observable<null> {
    return of(null);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('cartography page', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [CartographyPage, LeafletMapStubComponent],
      imports: [],
      providers: [
        CnfsRestTestDouble,
        {
          deps: [CnfsRestTestDouble],
          provide: ListCnfsPositionUseCase,
          useFactory: (cnfsRepository: CnfsRepository): ListCnfsPositionUseCase => new ListCnfsPositionUseCase(cnfsRepository)
        }
      ]
    })
      .overrideComponent(CartographyPage, {
        set: {
          providers: [
            {
              provide: CartographyPresenter,
              useClass: CartographyPresenterStub
            }
          ]
        }
      })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`CartographyPage`);
      });
  });

  it('should create the CartographyPage component', (): void => {
    const fixture: ComponentFixture<CartographyPage> = TestBed.createComponent(CartographyPage);
    const cartographyPageComponentInstance: CartographyPage = fixture.componentInstance;
    expect(cartographyPageComponentInstance).toBeTruthy();
  });
});
