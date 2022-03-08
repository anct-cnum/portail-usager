import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartographyLayout } from './cartography.layout';
import { FailedToCompileError } from '@angular-common/errors';
import { CnfsRestTestDouble } from '../../../../use-cases/test-doubles/cnfs-rest-test-double';
import { CartographyPresenter } from './cartography.presenter';
import {
  CnfsDetailsStubPage,
  CnfsListStubPage,
  IncompleteDataNoticeStubComponent,
  PermanenceMapStubComponent,
  SwitchMapListStubComponent
} from '../../test-doubles';
import { CARTOGRAPHY_TOKEN } from '../../../configuration';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Provider } from '@angular/core';
import { CnfsListPresenter } from '../../pages';

const CARTOGRAPHY_PRESENTER: CartographyPresenter = {
  centerView$: of({}),
  displayStructureDetails$: of(false)
} as CartographyPresenter;

const PROVIDERS: Provider[] = [
  {
    provide: CartographyPresenter,
    useValue: CARTOGRAPHY_PRESENTER
  },
  {
    provide: CnfsListPresenter,
    useValue: {}
  },
  {
    provide: CARTOGRAPHY_TOKEN,
    useValue: {}
  }
];

describe('cartography layout', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [
        CartographyLayout,
        IncompleteDataNoticeStubComponent,
        SwitchMapListStubComponent,
        PermanenceMapStubComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            component: CnfsDetailsStubPage,
            path: ':structureId/details'
          },
          {
            component: CnfsListStubPage,
            path: ':structureId'
          }
        ])
      ],
      providers: [CnfsRestTestDouble]
    })
      .overrideComponent(CartographyLayout, {
        set: {
          providers: PROVIDERS
        }
      })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`CartographyLayout`);
      });
  });

  it('should create the Cartography layout', (): void => {
    const fixture: ComponentFixture<CartographyLayout> = TestBed.createComponent(CartographyLayout);
    const component: CartographyLayout = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
