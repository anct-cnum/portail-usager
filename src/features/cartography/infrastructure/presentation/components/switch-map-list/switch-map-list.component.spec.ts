import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchMapListComponent } from './switch-map-list.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('Display-map component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [SwitchMapListComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('DisplayMap');
      });
  });

  it('should create the DisplayMap component', (): void => {
    const fixture: ComponentFixture<SwitchMapListComponent> = TestBed.createComponent(SwitchMapListComponent);
    const displayMapComponentInstance: SwitchMapListComponent = fixture.componentInstance;
    expect(displayMapComponentInstance).toBeTruthy();
  });
});
