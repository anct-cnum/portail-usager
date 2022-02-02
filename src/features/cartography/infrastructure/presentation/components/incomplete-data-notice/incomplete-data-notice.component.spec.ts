import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FailedToCompileError } from '@angular-common/errors';
import { MARKERS_TOKEN } from '../../../configuration';
import { LeafletMapStubComponent } from '../../test-doubles';
import { IncompleteDataNoticeComponent } from './incomplete-data-notice.component';

describe('incomplete data notice component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [IncompleteDataNoticeComponent, LeafletMapStubComponent],
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
        throw new FailedToCompileError('IncompleteDataNotice');
      });
  });

  it('should create the IncompleteDataNotice component', (): void => {
    const fixture: ComponentFixture<IncompleteDataNoticeComponent> = TestBed.createComponent(IncompleteDataNoticeComponent);
    const incompleteDataNoticeComponentInstance: IncompleteDataNoticeComponent = fixture.componentInstance;
    expect(incompleteDataNoticeComponentInstance).toBeTruthy();
  });
});
