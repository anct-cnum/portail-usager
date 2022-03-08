import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceMapComponent } from './permanence-map.component';
import { FailedToCompileError } from '@angular-common/errors';
import { MARKERS_TOKEN } from '../../../configuration';
import { LeafletMapStubComponent } from '../../test-doubles';
import { DepartmentPermanenceMapPresenter } from './department-permanence-map.presenter';
import { RegionPermanenceMapPresenter } from './region-permanence-map.presenter';
import { CnfsPermanenceMapPresenter } from './cnfs-permanence-map.presenter';
import { CartographyPresenter } from '../../pages';
import { Observable, of } from 'rxjs';

describe('Permanence-map component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceMapComponent, LeafletMapStubComponent],
      imports: [],
      providers: [
        {
          provide: CartographyPresenter,
          useValue: {}
        }
      ]
    })
      .overrideComponent(PermanenceMapComponent, {
        set: {
          providers: [
            {
              provide: CnfsPermanenceMapPresenter,
              useValue: {
                visibleMapCnfsPermanencesThroughViewportAtZoomLevel$: (): Observable<null> => of(null)
              }
            },
            {
              provide: DepartmentPermanenceMapPresenter,
              useValue: {
                visibleMapCnfsByDepartmentAtZoomLevel$: (): Observable<null> => of(null)
              }
            },
            {
              provide: RegionPermanenceMapPresenter,
              useValue: {
                visibleMapCnfsByRegionAtZoomLevel$: (): Observable<null> => of(null)
              }
            },
            {
              provide: MARKERS_TOKEN,
              useValue: {}
            }
          ]
        }
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
