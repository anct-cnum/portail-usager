import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RootLayout } from './root.layout';
import { FailedToCompileError } from '@angular-common/errors';

describe('RootLayout', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [RootLayout],
      imports: [RouterTestingModule]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`RootLayout`);
      });
  });

  it('should create the app', (): void => {
    const fixture: ComponentFixture<RootLayout> = TestBed.createComponent(RootLayout);
    const rootLayout: RootLayout = fixture.componentInstance;
    expect(rootLayout).toBeTruthy();
  });
});
