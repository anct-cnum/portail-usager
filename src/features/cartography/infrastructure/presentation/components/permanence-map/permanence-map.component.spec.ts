import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceMapComponent } from './permanence-map.component';
import { FailedToCompileError } from '@angular-common/errors';
import { MARKERS_TOKEN } from '../../../configuration';
import { LeafletMapStubComponent } from '../../test-doubles';

describe('Permanence-map component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceMapComponent, LeafletMapStubComponent],
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
