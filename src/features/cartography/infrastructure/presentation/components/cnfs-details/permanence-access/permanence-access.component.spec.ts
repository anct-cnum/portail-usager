import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceAccessComponent } from './permanence-access.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('permanence-access component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceAccessComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('PermanenceAccess');
      });
  });

  it('should create the PermanenceAccess component', (): void => {
    const fixture: ComponentFixture<PermanenceAccessComponent> = TestBed.createComponent(PermanenceAccessComponent);
    const permanenceAccessComponentInstance: PermanenceAccessComponent = fixture.componentInstance;
    expect(permanenceAccessComponentInstance).toBeTruthy();
  });
});
