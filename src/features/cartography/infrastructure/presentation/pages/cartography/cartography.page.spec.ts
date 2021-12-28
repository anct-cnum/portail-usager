import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartographyPage } from './cartography.page';
import { FailedToCompileError } from '@angular-common/errors';
import { ListCnfsPositionUseCase } from '../../../../use-cases';
import { CnfsRestTestDouble } from '../../../../use-cases/test-doubles/cnfs-rest-test-double';
import { CnfsRepository } from '../../../../core';
import { CartographyPresenter } from './cartography.presenter';
import { Observable, of } from 'rxjs';
import { CnfsListStubComponent } from '../../test-doubles/components/cnfs-list/cnfs-list.component.stub';
import { AddressGeolocationStubComponent } from '../../test-doubles/components/address-geolocation/address-geolocation.component.stub';
import { LeafletMapStubComponent } from '../../test-doubles/components/leaflet-map/leaflet-map.component.stub';
import { CARTOGRAPHY_TOKEN } from '../../../configuration';
import { CenterView } from '../../models';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class CartographyPresenterStub {
  public centerView(): CenterView {
    return {} as CenterView;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public defaultMapOptions() {
    return {};
  }

  public geocodeAddress$(): Observable<null> {
    return of(null);
  }

  public listCnfsByRegionPositions$(): Observable<null> {
    return of(null);
  }

  public listCnfsPositions$(): Observable<null> {
    return of(null);
  }

  public structuresList$(): Observable<null> {
    return of(null);
  }

  public structuresListV2$(): Observable<null> {
    return of(null);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('cartography page', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [AddressGeolocationStubComponent, CartographyPage, LeafletMapStubComponent, CnfsListStubComponent],
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
            },
            {
              provide: CARTOGRAPHY_TOKEN,
              useValue: {}
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
