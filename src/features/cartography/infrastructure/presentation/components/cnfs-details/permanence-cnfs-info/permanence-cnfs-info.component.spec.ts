import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceCnfsInfoComponent } from './permanence-cnfs-info.component';
import { FailedToCompileError } from '@angular-common/errors';

describe('permanence-cnfs-info component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceCnfsInfoComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('PermanenceCnfsInfo');
      });
  });

  it('should create the PermanenceCnfsInfo component', (): void => {
    const fixture: ComponentFixture<PermanenceCnfsInfoComponent> = TestBed.createComponent(PermanenceCnfsInfoComponent);
    const permanenceCnfsInfoComponentInstance: PermanenceCnfsInfoComponent = fixture.componentInstance;
    expect(permanenceCnfsInfoComponentInstance).toBeTruthy();
  });
});
