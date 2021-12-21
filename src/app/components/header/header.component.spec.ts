import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('HeaderComponent', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`HeaderComponent`);
      });
  });

  it('should create component', (): void => {
    const fixture: ComponentFixture<HeaderComponent> = TestBed.createComponent(HeaderComponent);
    const component: HeaderComponent = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
