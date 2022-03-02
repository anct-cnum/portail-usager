/* eslint-disable max-lines */

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
  StructurePresentation,
  CenterView,
  MarkerHighLight,
  CnfsLocationPresentation
} from '../../models';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, CnfsDetails, Coordinates } from '../../../../core';
import { BehaviorSubject, filter, iif, map, Observable, of, Subject } from 'rxjs';
import {
  CnfsDetailsUseCase,
  GeocodeAddressUseCase,
  ListCnfsByDepartmentUseCase,
  ListCnfsByRegionUseCase,
  ListCnfsUseCase,
  SearchAddressUseCase
} from '../../../../use-cases';
import { Feature, FeatureCollection, Point } from 'geojson';
import { MapViewCullingService } from '../../services/map-view-culling.service';
import { combineLatestWith, mergeMap, share } from 'rxjs/operators';
import { cnfsPermanencesToStructurePresentations } from '../../models/structure/structure.presentation-mapper';
import { MarkerKey } from '../../../configuration';
import { ObservableCache } from '../../helpers/observable-cache';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { ViewportAndZoom } from '../../directives';
import { CnfsRest } from '../../../data/rest';
import { CnfsLocationTransfer } from '../../../data/models';
import { cnfsPositionTransferToPresentation } from '../../models/cnfs/cnfs-postition.presentation-mapper';

export interface HighlightedStructure {
  id: string;
  type: MarkerHighLight;
}

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
  cnfsPermanence: Feature<Point, CnfsPermanenceMarkerProperties>,
  highlight: MarkerHighLight
): Feature<Point, CnfsPermanenceMarkerProperties> => ({
  ...cnfsPermanence,
  ...{
    properties: {
      ...cnfsPermanence.properties,
      highlight
    }
  }
});

const highlightPermanence = (
  listCnfsPermanencesInViewport: Feature<Point, CnfsPermanenceMarkerProperties>[],
  highlightedStructure: HighlightedStructure | null
): Feature<Point, CnfsPermanenceMarkerProperties>[] =>
  listCnfsPermanencesInViewport.map(
    (cnfsPermanence: Feature<Point, CnfsPermanenceMarkerProperties>): Feature<Point, CnfsPermanenceMarkerProperties> =>
      cnfsPermanence.properties.id === highlightedStructure?.id
        ? highlightedPermanence(cnfsPermanence, highlightedStructure.type)
        : cnfsPermanence
  );

// TODO Inject though configuration token
const DEFAULT_MAP_VIEWPORT_AND_ZOOM: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

@Injectable()
export class CartographyPresenter {
  private readonly _centerView$: Subject<CenterView> = new Subject<CenterView>();

  private readonly _cnfsByDepartment$: Observable<Feature<Point, MarkerProperties<CnfsByDepartmentProperties>>[]> =
    this.listCnfsByDepartmentUseCase.execute$().pipe(map(cnfsByDepartmentToPresentation), share());

  private readonly _cnfsByRegion$: Observable<Feature<Point, MarkerProperties<CnfsByRegionProperties>>[]> =
    this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation), share());

  private readonly _cnfsPermanences$: Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> =
    this.listCnfsPositionUseCase.execute$().pipe(map(cnfsCoreToCnfsPermanenceFeatures), share());

  private readonly _displayStructureDetails$: Subject<boolean> = new Subject<boolean>();

  private readonly _geocodeAddressError$: Subject<boolean> = new Subject<boolean>();

  private readonly _highlightedStructure$: BehaviorSubject<HighlightedStructure | null> =
    new BehaviorSubject<HighlightedStructure | null>(null);

  private readonly _markersDepartmentCache: ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByDepartmentMarkerProperties>[], MarkerKey>();

  private readonly _markersPermanencesCache: ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], MarkerKey>();

  private readonly _markersRegionCache: ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey> =
    new ObservableCache<Feature<Point, CnfsByRegionMarkerProperties>[], MarkerKey>();

  private _usagerCoordinates?: Coordinates;

  private readonly _viewportAndZoom$: BehaviorSubject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );

  public centerView$: Observable<CenterView> = this._centerView$.asObservable();

  public displayStructureDetails$: Observable<boolean> = this._displayStructureDetails$.asObservable();

  public geocodeAddressError$: Observable<boolean> = this._geocodeAddressError$.asObservable();

  public highlightedStructure$: Observable<HighlightedStructure> = this._highlightedStructure$.pipe(
    filter(
      (highlightedStructure: HighlightedStructure | null): highlightedStructure is HighlightedStructure =>
        highlightedStructure !== null
    )
  );

  public constructor(
    @Inject(CnfsDetailsUseCase) private readonly cnfsDetailsUseCase: CnfsDetailsUseCase,
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase,
    @Inject(ListCnfsUseCase) private readonly listCnfsPositionUseCase: ListCnfsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(SearchAddressUseCase) private readonly searchAddressUseCase: SearchAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService,
    @Inject(CnfsRest) private readonly cnfsRest: CnfsRest
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
    highlightedStructure: HighlightedStructure | null
  ): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> {
    return this.cnfsPermanencesInViewportOrEmpty$(markerTypeToDisplay, viewportAndZoom).pipe(
      map(
        (
          listCnfsPermanencesInViewport: Feature<Point, CnfsPermanenceMarkerProperties>[]
        ): Feature<Point, CnfsPermanenceMarkerProperties>[] =>
          highlightPermanence(listCnfsPermanencesInViewport, highlightedStructure)
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

  public clearStructureHighlight(): void {
    this._highlightedStructure$.next({
      id: '',
      type: MarkerHighLight.Hint
    });
  }

  public cnfsByRegionOrEmpty$(markerTypeToDisplay: MarkerKey): Observable<Feature<Point, CnfsByRegionMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === MarkerKey.CnfsByRegion,
      this._markersRegionCache.request$(this._cnfsByRegion$, MarkerKey.CnfsByRegion),
      of([])
    );
  }

  public cnfsDetails$(id: string): Observable<CnfsDetailsPresentation> {
    return this.cnfsDetailsUseCase
      .execute$(id)
      .pipe(
        map(
          (cnfsDetails: CnfsDetails): CnfsDetailsPresentation => cnfsDetailsToPresentation(cnfsDetails, this._usagerCoordinates)
        )
      );
  }

  public cnfsPosition$(id: string): Observable<CnfsLocationPresentation> {
    return this.cnfsRest
      .cnfsLocation$(id)
      .pipe(
        map(
          (cnfsLocation: CnfsLocationTransfer): CnfsLocationPresentation => cnfsPositionTransferToPresentation(cnfsLocation, id)
        )
      );
  }

  public focusStructure(structureId: string): void {
    this._highlightedStructure$.next({
      id: structureId,
      type: MarkerHighLight.Focus
    });
  }

  public geocodeAddress$(addressToGeocode: string): Observable<Coordinates> {
    return this.geocodeAddressUseCase.execute$(addressToGeocode);
  }

  public hintStructure(structureId: string): void {
    this._highlightedStructure$.next({
      id: structureId,
      type: MarkerHighLight.Hint
    });
  }

  public searchAddress$(searchTerm: string): Observable<AddressFoundPresentation[]> {
    return this.searchAddressUseCase.execute$(searchTerm);
  }

  public setGeocodeAddressError(geocodeAddressError: boolean): void {
    this._geocodeAddressError$.next(geocodeAddressError);
  }

  public setMapView(coordinates: Coordinates, zoomLevel: number): void {
    this._centerView$.next({ coordinates, zoomLevel });
  }

  public setStructureDetailsDisplay(display: boolean): void {
    this._displayStructureDetails$.next(display);
  }

  public setUsagerCoordinates(usagerCoordinates: Coordinates): void {
    this._usagerCoordinates = usagerCoordinates;
  }

  public setViewportAndZoom(viewportAndZoom: ViewportAndZoom): void {
    this._viewportAndZoom$.next(viewportAndZoom);
  }

  public structuresList$(): Observable<StructurePresentation[]> {
    return this._viewportAndZoom$.pipe(
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
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<FeatureCollection<Point, CnfsByDepartmentMarkerProperties>> {
    return this.cnfsByDepartmentAtZoomLevel$(this._viewportAndZoom$, forceCnfsPermanenceDisplay$).pipe(
      map(
        (
          cnfsByDepartementFeatures: Feature<Point, CnfsByDepartmentMarkerProperties>[]
        ): FeatureCollection<Point, CnfsByDepartmentMarkerProperties> => ({
          features: cnfsByDepartementFeatures,
          type: 'FeatureCollection'
        })
      )
    );
  }

  public visibleMapCnfsByRegionAtZoomLevel$(
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<FeatureCollection<Point, CnfsByRegionMarkerProperties>> {
    return this.cnfsByRegionAtZoomLevel$(this._viewportAndZoom$, forceCnfsPermanenceDisplay$).pipe(
      map(
        (
          cnfsByRegionFeatures: Feature<Point, CnfsByRegionMarkerProperties>[]
        ): FeatureCollection<Point, CnfsByRegionMarkerProperties> => ({
          features: cnfsByRegionFeatures,
          type: 'FeatureCollection'
        })
      )
    );
  }

  // eslint-disable-next-line max-lines-per-function
  public visibleMapCnfsPermanencesThroughViewportAtZoomLevel$(
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false)
  ): Observable<FeatureCollection<Point, CnfsPermanenceMarkerProperties>> {
    return this._viewportAndZoom$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$, this._highlightedStructure$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay, highlightedStructure]: [
          ViewportAndZoom,
          boolean,
          HighlightedStructure | null
        ]): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> =>
          this.cnfsPermanencesWithHighlightThroughViewportAtZoomLevel$(
            getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel),
            viewportWithZoomLevel,
            highlightedStructure
          )
      ),
      map(
        (
          cnfsPermanencesFeatures: Feature<Point, CnfsPermanenceMarkerProperties>[]
        ): FeatureCollection<Point, CnfsPermanenceMarkerProperties> => ({
          features: cnfsPermanencesFeatures,
          type: 'FeatureCollection'
        })
      )
    );
  }
}
