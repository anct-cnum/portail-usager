import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { FailedToCompileError } from '@angular-common/errors';
import { SlugifyStubPipe } from '../../../test-doubles';

describe('menu component', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent, SlugifyStubPipe]
    })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`MenuComponent`);
      });
  });

  it('should create component', (): void => {
    const fixture: ComponentFixture<MenuComponent> = TestBed.createComponent(MenuComponent);
    const component: MenuComponent = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should be initialized with expended value set to false by default', (): void => {
    const fixture: ComponentFixture<MenuComponent> = TestBed.createComponent(MenuComponent);
    const component: MenuComponent = fixture.componentInstance;

    expect(component.expanded).toBe(false);
  });

  it('should be initialized with expended value set to true', (): void => {
    const fixture: ComponentFixture<MenuComponent> = TestBed.createComponent(MenuComponent);
    const component: MenuComponent = fixture.componentInstance;
    component.expanded = true;

    expect(component.expanded).toBe(true);
  });

  it('should toggle from false to true', (): void => {
    const fixture: ComponentFixture<MenuComponent> = TestBed.createComponent(MenuComponent);
    const component: MenuComponent = fixture.componentInstance;

    fixture.detectChanges();

    component.toggle();

    expect(component.expanded).toBe(true);
  });

  it('should toggle from true to false', (): void => {
    const fixture: ComponentFixture<MenuComponent> = TestBed.createComponent(MenuComponent);
    const component: MenuComponent = fixture.componentInstance;
    component.expanded = true;

    fixture.detectChanges();

    component.toggle();

    expect(component.expanded).toBe(false);
  });
});
