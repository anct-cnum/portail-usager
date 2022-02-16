import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CnfsDetailsComponent } from './cnfs-details.component';
import { FailedToCompileError } from '@angular-common/errors';
import {
  CnfsDetailsContactStubComponent,
  PermanenceAccessStubComponent,
  PermanenceAddressStubComponent,
  PermanenceCnfsInfoStubComponent,
  PermanenceCnfsListStubComponent,
  PermanenceOpeningHoursStubComponent
} from '../../test-doubles';

describe('cnfs-details component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [
        CnfsDetailsComponent,
        CnfsDetailsContactStubComponent,
        PermanenceAccessStubComponent,
        PermanenceAddressStubComponent,
        PermanenceOpeningHoursStubComponent,
        PermanenceCnfsInfoStubComponent,
        PermanenceCnfsListStubComponent
      ]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('CnfsDetails');
      });
  });

  it('should create the CnfsDetails component', (): void => {
    const fixture: ComponentFixture<CnfsDetailsComponent> = TestBed.createComponent(CnfsDetailsComponent);
    const cnfsDetailsComponentInstance: CnfsDetailsComponent = fixture.componentInstance;
    expect(cnfsDetailsComponentInstance).toBeTruthy();
  });
});
