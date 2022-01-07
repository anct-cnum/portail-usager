import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayMapComponent } from './display-map.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('Display-map component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [DisplayMapComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('DisplayMap');
      });
  });

  it('should create the DisplayMap component', (): void => {
    const fixture: ComponentFixture<DisplayMapComponent> = TestBed.createComponent(DisplayMapComponent);
    const displayMapComponentInstance: DisplayMapComponent = fixture.componentInstance;
    expect(displayMapComponentInstance).toBeTruthy();
  });
});
