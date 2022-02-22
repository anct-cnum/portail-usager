import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CnfsDetailsPage } from './cnfs-details.page';
import { FailedToCompileError } from '@angular-common/errors';
import { CartographyPresenter } from '../cartography';
import { RouterTestingModule } from '@angular/router/testing';
import { CARTOGRAPHY_TOKEN } from '../../../configuration';
import { CnfsDetailsStubComponent } from '../../test-doubles';

describe('cnfs-details page', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [CnfsDetailsPage, CnfsDetailsStubComponent],
      imports: [RouterTestingModule]
    })
      .overrideComponent(CnfsDetailsPage, {
        set: {
          providers: [
            {
              provide: CartographyPresenter,
              useValue: {}
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
        throw new FailedToCompileError('CnfsDetails');
      });
  });

  it('should create the CnfsDetails page', (): void => {
    const fixture: ComponentFixture<CnfsDetailsPage> = TestBed.createComponent(CnfsDetailsPage);
    const cnfsDetailsPageInstance: CnfsDetailsPage = fixture.componentInstance;
    expect(cnfsDetailsPageInstance).toBeTruthy();
  });
});
