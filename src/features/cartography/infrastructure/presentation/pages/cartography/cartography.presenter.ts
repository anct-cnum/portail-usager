import { Inject, Injectable } from '@angular/core';
import {
  AddressFoundPresentation,
  cnfsByDepartmentToPresentation,
  cnfsCoreToCnfsPermanenceFeatures,
  CnfsDetailsPresentation,
  cnfsDetailsToPresentation,
  CnfsPermanenceMarkerProperties,
  CnfsPermanenceProperties,
  listCnfsByRegionToPresentation,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  StructurePresentation,
  TypedMarker
} from '../../models';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { EMPTY, iif, map, merge, Observable, of, switchMap } from 'rxjs';
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
import { ViewportAndZoom } from '../../directives/leaflet-map-state-change';
import { cnfsPermanencesToStructurePresentations } from '../../models/structure/structure.presentation-mapper';
import { Marker } from '../../../configuration';
import { ObservableCache } from '../../helpers/observable-cache';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { usagerFeatureFromCoordinates } from '../../helpers';

const markerTypeToDisplayAtZoomLevel = (zoomLevel: number): Marker => {
  if (zoomLevel > DEPARTMENT_ZOOM_LEVEL) return Marker.CnfsPermanence;
  if (zoomLevel > REGION_ZOOM_LEVEL) return Marker.CnfsByDepartment;
  return Marker.CnfsByRegion;
};

const getMarkerToDisplay = (forceCnfsPermanenceDisplay: boolean, viewportWithZoomLevel: ViewportAndZoom): Marker =>
  forceCnfsPermanenceDisplay ? Marker.CnfsPermanence : markerTypeToDisplayAtZoomLevel(viewportWithZoomLevel.zoomLevel);

export const addUsagerFeatureToMarkers = (
  visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkerProperties>[],
  usagerCoordinates: Coordinates | null
): Feature<Point, PointOfInterestMarkerProperties | TypedMarker>[] =>
  usagerCoordinates == null
    ? visibleMapPointsOfInterest
    : [...visibleMapPointsOfInterest, usagerFeatureFromCoordinates(usagerCoordinates)];

export const isGuyaneBoundedMarker = (markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): boolean => {
  const departementProperties: CnfsByDepartmentProperties = markerEvent.markerProperties as CnfsByDepartmentProperties;
  const regionProperties: CnfsByRegionProperties = markerEvent.markerProperties as CnfsByRegionProperties;

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
  private readonly _markersCache: ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], Marker> =
    new ObservableCache<Feature<Point, PointOfInterestMarkerProperties>[], Marker>();

  public constructor(
    @Inject(CnfsDetailsUseCase) private readonly cnfsDetailsUseCase: CnfsDetailsUseCase,
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(ListCnfsByDepartmentUseCase) private readonly listCnfsByDepartmentUseCase: ListCnfsByDepartmentUseCase,
    @Inject(ListCnfsUseCase) private readonly listCnfsPositionUseCase: ListCnfsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(SearchAddressUseCase) private readonly searchAddressUseCase: SearchAddressUseCase,
    @Inject(MapViewCullingService) private readonly mapViewCullingService: MapViewCullingService
  ) {}

  private cnfsByDepartmentOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsByDepartment,
      this._markersCache.request$(this._cnfsByDepartment$, Marker.CnfsByDepartment),
      EMPTY
    );
  }

  private cnfsByRegionOrEmpty$(markerTypeToDisplay: Marker): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsByRegion,
      this._markersCache.request$(this._cnfsByRegion$, Marker.CnfsByRegion),
      EMPTY
    );
  }

  // eslint-disable-next-line max-lines-per-function
  private cnfsMarkersInViewportAtZoomLevel$(
    viewportWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean>,
    highlightedStructureId$: Observable<string | null>
  ): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return viewportWithZoomLevel$.pipe(
      combineLatestWith(forceCnfsPermanenceDisplay$, highlightedStructureId$),
      mergeMap(
        ([viewportWithZoomLevel, forceCnfsPermanenceDisplay, highlightedStructureId]: [
          ViewportAndZoom,
          boolean,
          string | null
        ]): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> =>
          this.mergedMarkersFilteredByTypeToDisplay$(
            getMarkerToDisplay(forceCnfsPermanenceDisplay, viewportWithZoomLevel),
            viewportWithZoomLevel,
            highlightedStructureId
          )
      )
    );
  }

  private cnfsPermanences$(): Observable<Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]> {
    return this._markersCache.request$(this._cnfsPermanences$, Marker.CnfsPermanence) as Observable<
      Feature<Point, MarkerProperties<CnfsPermanenceProperties>>[]
    >;
  }

  private cnfsPermanencesInViewportOrEmpty$(
    markerTypeToDisplay: Marker,
    viewportAndZoom: ViewportAndZoom
  ): Observable<Feature<Point, CnfsPermanenceMarkerProperties>[]> {
    return iif(
      (): boolean => markerTypeToDisplay === Marker.CnfsPermanence,
      this.listCnfsPermanencesInViewport$(viewportAndZoom),
      EMPTY
    );
  }

  private cnfsPermanencesWithHighlight$(
    markerTypeToDisplay: Marker,
    viewportAndZoom: ViewportAndZoom,
    highlightedStructureId: string | null
  ): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return this.cnfsPermanencesInViewportOrEmpty$(markerTypeToDisplay, viewportAndZoom).pipe(
      map(
        (
          listCnfsPermanencesInViewport: Feature<Point, CnfsPermanenceMarkerProperties>[]
        ): Feature<Point, PointOfInterestMarkerProperties>[] =>
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

  private mergedMarkersFilteredByTypeToDisplay$(
    markerTypeToDisplay: Marker,
    viewportWithZoomLevel: ViewportAndZoom,
    highlightedStructureId: string | null
  ): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return merge(
      this.cnfsByRegionOrEmpty$(markerTypeToDisplay),
      this.cnfsByDepartmentOrEmpty$(markerTypeToDisplay),
      this.cnfsPermanencesWithHighlight$(markerTypeToDisplay, viewportWithZoomLevel, highlightedStructureId)
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
            (): boolean => markerTypeToDisplayAtZoomLevel(viewportAndZoom.zoomLevel) === Marker.CnfsPermanence,
            this.listCnfsPermanencesInViewport$(viewportAndZoom).pipe(map(cnfsPermanencesToStructurePresentations)),
            of([])
          )
      )
    );
  }

  public visibleMapPointsOfInterestThroughViewportAtZoomLevel$(
    viewBoxWithZoomLevel$: Observable<ViewportAndZoom>,
    forceCnfsPermanenceDisplay$: Observable<boolean> = of(false),
    highlightedStructureId$: Observable<string | null> = of('')
  ): Observable<Feature<Point, PointOfInterestMarkerProperties>[]> {
    return this.cnfsMarkersInViewportAtZoomLevel$(viewBoxWithZoomLevel$, forceCnfsPermanenceDisplay$, highlightedStructureId$);
  }
}
