import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CnfsListPage } from './cnfs-list.page';
import { FailedToCompileError } from '@angular-common/errors';
import { CartographyPresenter } from '../cartography';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { StructurePresentation } from '../../models';
import { AddressGeolocationStubComponent, CnfsListStubComponent } from '../../test-doubles';
import { CARTOGRAPHY_TOKEN } from '../../../configuration';

const CARTOGRAPHY_PRESENTER: CartographyPresenter = {
  structuresList$: (): Observable<StructurePresentation[]> =>
    of([
      {
        address: '12 rue des Acacias, 69002 Lyon',
        id: '4c38ebc9a06fdd532bf9d7be',
        isLabeledFranceServices: false,
        name: 'Association des centres sociaux et culturels de Lyon'
      },
      {
        address: '31 Avenue de la mer, 13003 Marseille',
        id: '88bc36fb0db191928330b1e6',
        isLabeledFranceServices: true,
        name: 'Médiathèque de la mer'
      }
    ])
} as CartographyPresenter;

describe('cnfs-list page', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [CnfsListPage, AddressGeolocationStubComponent, CnfsListStubComponent],
      imports: [RouterTestingModule]
    })
      .overrideComponent(CnfsListPage, {
        set: {
          providers: [
            {
              provide: CartographyPresenter,
              useValue: CARTOGRAPHY_PRESENTER
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
        throw new FailedToCompileError('CnfsList');
      });
  });

  it('should create the CnfsList page', (): void => {
    const fixture: ComponentFixture<CnfsListPage> = TestBed.createComponent(CnfsListPage);
    const cnfsListPageInstance: CnfsListPage = fixture.componentInstance;
    expect(cnfsListPageInstance).toBeTruthy();
  });
});
