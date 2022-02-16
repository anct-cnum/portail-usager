import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceOpeningHoursComponent } from './permanence-opening-hours.component';
import { FailedToCompileError } from '../../../../../../../utils/angular-common';

describe('permanence-opening-hours component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceOpeningHoursComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('PermanenceOpeningHours');
      });
  });

  it('should create the PermanenceOpeningHours component', (): void => {
    const fixture: ComponentFixture<PermanenceOpeningHoursComponent> = TestBed.createComponent(PermanenceOpeningHoursComponent);
    const permanenceOpeningHoursComponentInstance: PermanenceOpeningHoursComponent = fixture.componentInstance;
    expect(permanenceOpeningHoursComponentInstance).toBeTruthy();
  });
});
