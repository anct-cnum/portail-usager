import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentLayout } from './content.layout';
import { FailedToCompileError } from '@angular-common/errors';
import { HeaderStubComponent } from '../../../test-doubles';

describe('ContentLayout', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [ContentLayout, HeaderStubComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`ContentLayout`);
      });
  });

  it('should create the content layout', (): void => {
    const fixture: ComponentFixture<ContentLayout> = TestBed.createComponent(ContentLayout);
    const rootLayout: ContentLayout = fixture.componentInstance;
    expect(rootLayout).toBeTruthy();
  });
});
