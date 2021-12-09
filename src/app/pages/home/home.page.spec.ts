import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { FailedToCompileError } from '@angular-common/errors';

describe('home page', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [HomePage]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`Home Page`);
      });
  });

  it('should create the HomePage component', (): void => {
    const fixture: ComponentFixture<HomePage> = TestBed.createComponent(HomePage);
    const homePage: HomePage = fixture.componentInstance;
    expect(homePage).toBeTruthy();
  });
});
