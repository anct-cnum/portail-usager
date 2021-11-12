import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { CartographyPage } from './cartography.page';
import { LeafletMapStubComponent } from '../../test-doubles';
import { CartographyPresenter } from './cartography.presenter';
import { FailedToCompileError } from '@angular-common/errors';
import { ListCnfsPositionUseCase } from '../../../../use-cases';
import { CnfsRestTestDouble } from '../../../../use-cases/test-doubles/cnfs-rest-test-double';
import type { CnfsRepository } from '../../../../core';

// TODO Utiliser un double de test plutôt que d'injecter le vrai présenter
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
        },
        CartographyPresenter
      ]
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
