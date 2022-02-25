import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartographyLayout } from './cartography.layout';
import { FailedToCompileError } from '@angular-common/errors';
import { ListCnfsUseCase } from '../../../../use-cases';
import { CnfsRestTestDouble } from '../../../../use-cases/test-doubles/cnfs-rest-test-double';
import { CnfsRepository } from '../../../../core';
import { CartographyPresenter } from './cartography.presenter';
import {
  CnfsDetailsStubPage,
  CnfsListStubPage,
  IncompleteDataNoticeStubComponent,
  PermanenceMapStubComponent,
  SwitchMapListStubComponent
} from '../../test-doubles';
import { CARTOGRAPHY_TOKEN, MarkerKey } from '../../../configuration';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { FeatureCollection, Point } from 'geojson';
import { CnfsByDepartmentMarkerProperties, CnfsByRegionMarkerProperties, CnfsPermanenceMarkerProperties } from '../../models';
import { Provider } from '@angular/core';
import { CnfsListPresenter } from '../../pages';

const CARTOGRAPHY_PRESENTER: CartographyPresenter = {
  centerView$: of({}),
  displayStructureDetails$: of(false),
  visibleMapCnfsByDepartmentAtZoomLevel$: (): Observable<FeatureCollection<Point, CnfsByDepartmentMarkerProperties>> =>
    of({
      features: [
        {
          geometry: {
            coordinates: [6.053333, 43.955],
            type: 'Point'
          },
          properties: {
            boundingZoom: 8,
            code: '69',
            count: 2,
            department: 'Rhône',
            markerType: MarkerKey.CnfsByDepartment
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    }),
  visibleMapCnfsByRegionAtZoomLevel$: (): Observable<FeatureCollection<Point, CnfsByRegionMarkerProperties>> =>
    of({
      features: [
        {
          geometry: {
            coordinates: [6.053333, 43.955],
            type: 'Point'
          },
          properties: {
            boundingZoom: 8,
            count: 12,
            markerType: MarkerKey.CnfsByRegion,
            region: "Provence-Alpes-Côte d'Azur"
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    }),
  visibleMapCnfsPermanencesThroughViewportAtZoomLevel$: (): Observable<
    FeatureCollection<Point, CnfsPermanenceMarkerProperties>
  > =>
    of({
      features: [
        {
          geometry: {
            coordinates: [6.053333, 43.955],
            type: 'Point'
          },
          properties: {
            address: '6 RUE DU TOURNIQUET, MAIRIE, 85500 LES HERBIERS',
            id: '88bc36fb0db191928330b1e6',
            isLabeledFranceServices: false,
            markerType: MarkerKey.CnfsPermanence,
            name: 'CCAS des HERBIERS'
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    })
} as CartographyPresenter;

const PROVIDERS: Provider[] = [
  {
    provide: CartographyPresenter,
    useValue: CARTOGRAPHY_PRESENTER
  },
  {
    provide: CnfsListPresenter,
    useValue: {}
  },
  {
    provide: CARTOGRAPHY_TOKEN,
    useValue: {}
  }
];

describe('cartography layout', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [
        CartographyLayout,
        IncompleteDataNoticeStubComponent,
        SwitchMapListStubComponent,
        PermanenceMapStubComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            component: CnfsDetailsStubPage,
            path: ':structureId/details'
          },
          {
            component: CnfsListStubPage,
            path: ':structureId'
          }
        ])
      ],
      providers: [
        CnfsRestTestDouble,
        {
          deps: [CnfsRestTestDouble],
          provide: ListCnfsUseCase,
          useFactory: (cnfsRepository: CnfsRepository): ListCnfsUseCase => new ListCnfsUseCase(cnfsRepository)
        }
      ]
    })
      .overrideComponent(CartographyLayout, {
        set: {
          providers: PROVIDERS
        }
      })
      .compileComponents()
      .catch((): void => {
        throw new FailedToCompileError(`CartographyLayout`);
      });
  });

  it('should create the Cartography layout', (): void => {
    const fixture: ComponentFixture<CartographyLayout> = TestBed.createComponent(CartographyLayout);
    const component: CartographyLayout = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
