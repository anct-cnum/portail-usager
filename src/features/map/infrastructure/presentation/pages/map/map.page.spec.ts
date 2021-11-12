import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MapPage } from '../../../../infrastructure/presentation';

describe('map page', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [MapPage],
      imports: []
    })
      .compileComponents()
      .catch((): void => {
        throw new Error(`Failed to compile MapPage component`);
      });
  });

  it('should create the component', (): void => {
    const fixture: ComponentFixture<MapPage> =
      TestBed.createComponent(MapPage);
    const map: MapPage = fixture.componentInstance;
    expect(map).toBeTruthy();
  });
});
