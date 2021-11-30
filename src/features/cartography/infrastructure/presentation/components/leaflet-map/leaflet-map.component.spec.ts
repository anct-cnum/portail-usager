import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { LeafletMapComponent } from './leaflet-map.component';
import { FailedToCompileError } from '@angular-common/errors';
import { MARKERS_TOKEN } from '../../../configuration';

describe('Leaflet-map component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [LeafletMapComponent],
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
        throw new FailedToCompileError('LeafletMap');
      });
  });

  it('should create the LeafletMap component', (): void => {
    const fixture: ComponentFixture<LeafletMapComponent> = TestBed.createComponent(LeafletMapComponent);
    const leafletMapComponentInstance: LeafletMapComponent = fixture.componentInstance;
    expect(leafletMapComponentInstance).toBeTruthy();
  });
});
