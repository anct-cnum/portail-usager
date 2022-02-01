import { Inject, Injectable } from '@angular/core';
import {
  AddressFoundPresentation,
  cnfsByDepartmentToPresentation,
  CnfsByDepartmentMarkerProperties,
  CnfsByRegionMarkerProperties,
  cnfsCoreToCnfsPermanenceFeatures,
  CnfsDetailsPresentation,
  cnfsDetailsToPresentation,
  CnfsPermanenceMarkerProperties,
  CnfsPermanenceProperties,
  listCnfsByRegionToPresentation,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  StructurePresentation
} from '../../models';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { EMPTY, iif, map, Observable, of, switchMap } from 'rxjs';
import {
  CnfsDetailsUseCase,
  GeocodeAddressUseCase,
  ListCnfsByDepartmentUseCase,
  ListCnfsByRegionUseCase,
  ListCnfsUseCase,
  SearchAddressUseCase
} from '../../../../use-cases';
import { Feature, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { catchError, combineLatestWith, mergeMap, share } from 'rxjs/operators';
import { cnfsPermanencesToStructurePresentations } from '../../models/structure/structure.presentation-mapper';
import { MarkerKey } from '../../../configuration';
import { ObservableCache } from '../../helpers/observable-cache';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { ViewportAndZoom } from '../../directives';

const markerTypeToDisplayAtZoomLevel = (zoomLevel: number): MarkerKey => {
  if (zoomLevel > DEPARTMENT_ZOOM_LEVEL) return MarkerKey.CnfsPermanence;
  if (zoomLevel > REGION_ZOOM_LEVEL) return MarkerKey.CnfsByDepartment;
  return MarkerKey.CnfsByRegion;
};

const getMarkerToDisplay = (forceCnfsPermanenceDisplay: boolean, viewportWithZoomLevel: ViewportAndZoom): MarkerKey =>
  forceCnfsPermanenceDisplay ? MarkerKey.CnfsPermanence : markerTypeToDisplayAtZoomLevel(viewportWithZoomLevel.zoomLevel);

export const isGuyaneBoundedMarker = (markerProperties: PointOfInterestMarkerProperties): boolean => {
  const departementProperties: CnfsByDepartmentProperties = markerProperties as CnfsByDepartmentProperties;
  const regionProperties: CnfsByRegionProperties = markerProperties as CnfsByRegionProperties;

  return departementProperties.department === 'Guyane' || regionProperties.region === 'Guyane';
};

const highlightedPermanence = (
  cnfsPermanence: Feature<Point, CnfsPermanenceMarkerProperties>
): Feature<Point, CnfsPermanenceMarkerProperties> => ({
  ...cnfsPermanence,
  ...{
    properties: {
      ...cnfsPermanence.properties,
      highlight: true
    }
  }
});

const highlightPermanence = (
  listCnfsPermanencesInViewport: Feature<Point, CnfsPermanenceMarkerProperties>[],
  highlightedStructureId: string | null
): Feature<Point, CnfsPermanenceMarkerProperties>[] =>
  listCnfsPermanencesInViewport.map(
    (cnfsPermanence: Feature<Point, CnfsPermanenceMarkerProperties>): Feature<Point, CnfsPermanenceMarkerProperties> =>
      cnfsPermanence.properties.id === highlightedStructureId ? highlightedPermanence(cnfsPermanence) : cnfsPermanence
  );

@Injectable()
export class CartographyPresenter {
  private readonly _cnfsByDepartment$: Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> =
    this.listCnfsByDepartmentUseCase.execute$().pipe(map(cnfsByDepartmentToPresentation), share());
  private readonly _cnfsByRegion$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
    this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation), share());
  private readonly _cnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
    this.listCnfsPositionUseCase.execute$().pipe(map(cnfsCoreToCnfsPermanenceFeatures), share());

  private readonly _markersDepartmentCache: ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey>();

  private readonly _markersPermanencesCache: ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey>();

  private readonly _markersRegionCache: ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey>();

  public constructor(
    @Inject(CnfsDetailsUseCase) private readonly cnfsDetailsUseCase: CnfsDetailsUseCase,
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase,
    @Inject(ListCnfsUseCase) private readonly listCnfsPositionUseCase: ListCnfsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(SearchAddressUseCase) private readonly searchAddressUseCase: SearchAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private cnfsByDepartmentAtZoomLevel$(
    viewportWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean>
  ): Observable<Feature<Point, CnfsByDepartmentMarkerProperties>[]> {
    return viewportWithZoomLevel$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay]: [ViewportAndZoom, boolean]): Observable<
          Feature<Point, CnfsByDepartmentMarkerProperties>[]
        > => this.cnfsByDepartmentOrEmpty$(getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel))
      )
    );
  }

  private cnfsByDepartmentOrEmpty$(
    markerTypeToDisplay: MarkerKey
  ): Observable<Feature<Point, CnfsByDepartmentMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsByDepartment,
      this._markersDepartmentCache.request$(this._cnfsByDepartment$, MarkerKey.CnfsByDepartment),
      of([])
    );
  }

  private cnfsByRegionAtZoomLevel$(
    viewportWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean>
  ): Observable<Feature<Point, CnfsByRegionMarkerProperties>[]> {
    return viewportWithZoomLevel$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay]: [ViewportAndZoom, boolean]): Observable<
          Feature<Point, CnfsByRegionMarkerProperties>[]
        > => this.cnfsByRegionOrEmpty$(getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel))
      )
    );
  }

  private cnfsPermanences$(): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return this._markersPermanencesCache.request$(this._cnfsPermanences$, MarkerKey.CnfsPermanence) as Observable<
      Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
    >;
  }

  private cnfsPermanencesInViewportOrEmpty$(
    markerTypeToDisplay: MarkerKey,
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsPermanence,
      this.listCnfsPermanencesInViewport$(viewportAndZoom),
      of([])
    );
  }

  private cnfsPermanencesWithHighlightThroughViewportAtZoomLevel$(
    markerTypeToDisplay: MarkerKey,
    viewportAndZoom: ViewportAndZoom,
    highlightedStructureId: string | null
  ): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> {
    return this.cnfsPermanencesInViewportOrEmpty$(markerTypeToDisplay, viewportAndZoom).pipe(
      map(
        (
          listCnfsPermanencesInViewport: Feature<Point, CnfsPermanenceMarkerProperties>[]
        ): Feature<Point, CnfsPermanenceMarkerProperties>[] =>
          highlightPermanence(listCnfsPermanencesInViewport, highlightedStructureId)
      )
    );
  }

  private listCnfsPermanencesInViewport$(
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return this.cnfsPermanences$().pipe(
      map(
        (
          allCnfs: Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
        ): Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[] =>
          this.mapViewCullingService.cull(allCnfs, viewportAndZoom)
      ),
      share()
    );
  }

  public cnfsByRegionOrEmpty$(markerTypeToDisplay: MarkerKey): Observable<Feature<Point, CnfsByRegionMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsByRegion,
      this._markersRegionCache.request$(this._cnfsByRegion$, MarkerKey.CnfsByRegion),
      of([])
    );
  }

  public cnfsDetails$(id: string): Observable<CnfsDetailsPresentation> {
    return this.cnfsDetailsUseCase.execute$(id).pipe(map(cnfsDetailsToPresentation));
  }

  public geocodeAddress$(addressToGeocode$: Observable<string>): Observable<Coordinates> {
    return addressToGeocode$.pipe(
      switchMap(
        (address: string): Observable<Coordinates> =>
          this.geocodeAddressUseCase.execute$(address).pipe(catchError((): Observable<never> => EMPTY))
      )
    );
  }

  public searchAddress$(searchTerm: string): Observable<AddressFoundPresentation[]> {
    return this.searchAddressUseCase.execute$(searchTerm);
  }

  public structuresList$(viewportAndZoom$: Observable<ViewportAndZoom>): Observable<StructurePresentation[]> {
    return viewportAndZoom$.pipe(
      mergeMap(
        (viewportAndZoom: ViewportAndZoom): Observable<StructurePresentation[]> =>
          iif(
            (): boolean => markerTypeToDisplayAtZoomLevel(viewportAndZoom.zoomLevel) === MarkerKey.CnfsPermanence,
            this.listCnfsPermanencesInViewport$(viewportAndZoom).pipe(map(cnfsPermanencesToStructurePresentations)),
            of([])
          )
      )
    );
  }

  public visibleMapCnfsByDepartmentAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<Feature<Point, CnfsByDepartmentMarkerProperties>[]> {
    return this.cnfsByDepartmentAtZoomLevel$(viewBoxWithZoomLevel$, forceCnfsPermanenceDisplay$);
  }

  public visibleMapCnfsByRegionAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<Feature<Point, CnfsByRegionMarkerProperties>[]> {
    return this.cnfsByRegionAtZoomLevel$(viewBoxWithZoomLevel$, forceCnfsPermanenceDisplay$);
  }

  // eslint-disable-next-line max-lines-per-function
  public visibleMapCnfsPermanencesThroughViewportAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false),
    highlightedStructureId$: Observable<string | null> = of('')
  ): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> {
    return viewBoxWithZoomLevel$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$, highlightedStructureId$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay, highlightedStructureId]: [
          ViewportAndZoom,
          boolean,
          string | null
        ]): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> =>
          this.cnfsPermanencesWithHighlightThroughViewportAtZoomLevel$(
            getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel),
            viewportWithZoomLevel,
            highlightedStructureId
          )
      )
    );
  }
}
