import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermanenceCnfsListComponent } from './permanence-cnfs-list.component';
import { FailedToCompileError } from '../../../../../../../utils/angular-common';

describe('permanence-cnfs-list component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PermanenceCnfsListComponent]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError('PermanenceCnfsList');
      });
  });

  it('should create the PermanenceCnfsList component', (): void => {
    const fixture: ComponentFixture<PermanenceCnfsListComponent> = TestBed.createComponent(PermanenceCnfsListComponent);
    const permanenceCnfsListComponentInstance: PermanenceCnfsListComponent = fixture.componentInstance;
    expect(permanenceCnfsListComponentInstance).toBeTruthy();
  });
});
