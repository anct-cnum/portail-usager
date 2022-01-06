import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CnfsDetailsContactComponent } from './cnfs-details-contact.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('cnfs-details-contact component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [CnfsDetailsContactComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('CnfsDetailsContact');
      });
  });

  it('should create the CnfsDetailsContact component', (): void => {
    const fixture: ComponentFixture<CnfsDetailsContactComponent> = TestBed.createComponent(CnfsDetailsContactComponent);
    const cnfsDetailsContactComponentInstance: CnfsDetailsContactComponent = fixture.componentInstance;
    expect(cnfsDetailsContactComponentInstance).toBeTruthy();
  });
});
