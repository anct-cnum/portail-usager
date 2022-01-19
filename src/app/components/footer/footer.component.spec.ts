import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('FooterComponent', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`FooterComponent`);
      });
  });

  it('should create component', (): void => {
    const fixture: ComponentFixture<FooterComponent> = TestBed.createComponent(FooterComponent);
    const component: FooterComponent = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
