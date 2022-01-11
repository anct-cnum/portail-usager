import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceMapComponent } from './permanence-map.component';
import { FailedToCompileError } from '@angular-common/errors';
import { MARKERS_TOKEN } from '../../../configuration';

describe('Permanence-map component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceMapComponent],
      imports: [],
      providers: [
        {
          provide: MARKERS_TOKEN,
          useValue: {}
        }
      ]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('PermanenceMap');
      });
  });

  it('should create the PermanenceMap component', (): void => {
    const fixture: ComponentFixture<PermanenceMapComponent> = TestBed.createComponent(PermanenceMapComponent);
    const permanenceMapComponentInstance: PermanenceMapComponent = fixture.componentInstance;
    expect(permanenceMapComponentInstance).toBeTruthy();
  });
});
