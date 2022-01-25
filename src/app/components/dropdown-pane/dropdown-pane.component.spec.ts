import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownPaneComponent } from './dropdown-pane.component';
import { FailedToCompileError } from '../../../utils/angular-common';

describe('DropdownPaneComponent', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [DropdownPaneComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`DropdownPaneComponent`);
      });
  });

  it('should create component', (): void => {
    const fixture: ComponentFixture<DropdownPaneComponent> = TestBed.createComponent(DropdownPaneComponent);
    const component: DropdownPaneComponent = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
