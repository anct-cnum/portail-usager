import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceAddressComponent } from './permanence-address.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('permanence-address component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceAddressComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('PermanenceAddress');
      });
  });

  it('should create the PermanenceAddress component', (): void => {
    const fixture: ComponentFixture<PermanenceAddressComponent> = TestBed.createComponent(PermanenceAddressComponent);
    const permanenceAddressComponentInstance: PermanenceAddressComponent = fixture.componentInstance;
    expect(permanenceAddressComponentInstance).toBeTruthy();
  });
});
