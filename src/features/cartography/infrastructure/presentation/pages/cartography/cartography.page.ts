import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  CenterView,
  CnfsPermanenceProperties,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkers,
  StructurePresentation,
  TypedMarker
} from '../../models';
import {
  CartographyPresenter,
  coordinatesToCenterView,
  departmentMarkerEventToCenterView,
  permanenceMarkerEventToCenterView,
  regionMarkerEventToCenterView
} from './cartography.presenter';
import { BehaviorSubject, merge, Observable, of, Subject, tap } from 'rxjs';
import { CnfsByDepartmentProperties, CnfsByRegionProperties, Coordinates } from '../../../../core';
import { ViewportAndZoom, ViewReset } from '../../directives/leaflet-map-state-change';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN, Marker } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { catchError, combineLatestWith, map, startWith } from 'rxjs/operators';

// TODO Inject though configuration token
const DEFAULT_MAP_VIEWPORT_AND_ZOOM: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const usagerFeatureFromCoordinates = (coordinates: Coordinates): Feature<Point, TypedMarker> => ({
  geometry: {
    coordinates: [coordinates.longitude, coordinates.latitude],
    type: 'Point'
  },
  properties: {
    markerType: Marker.Usager,
    zIndexOffset: 1000
  },
  type: 'Feature'
})

const addUsagerFeatureToMarkers = (visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkers>[], usagerCoordinates: Coordinates | null): Feature<Point, PointOfInterestMarkers | TypedMarker>[] => (usagerCoordinates == null) ? visibleMapPointsOfInterest : [ ...visibleMapPointsOfInterest, usagerFeatureFromCoordinates(usagerCoordinates) ]

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
export class CartographyPage {
  private readonly _addressToGeocode$: Subject<string> = new Subject<string>();
  private readonly _mapViewportAndZoom$: Subject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );
  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  private readonly _visibleMapPointsOfInterest$: Observable<Feature<Point, PointOfInterestMarkers>[]> = merge(
    of([]),
    this.presenter.visibleMapPointsOfInterestThroughViewportAtZoomLevel$(this._mapViewportAndZoom$)
  );

  public centerView: CenterView = this.cartographyConfiguration;

  public hasAddressError: boolean = false;

  public readonly usagerCoordinates$: Observable<Coordinates | null> = merge(
    this.presenter.geocodeAddress$(this._addressToGeocode$),
    this._usagerCoordinates$
  ).pipe(
    tap((coordinates: Coordinates): void => {
      this.centerView = coordinatesToCenterView(coordinates);
    }),
    startWith(null),
    catchError((): Observable<null> => {
      this.hasAddressError = true;
      return of(null);
    })
  );

  public readonly visibleMarkersWithUsager$: Observable<FeatureCollection<Point, PointOfInterestMarkers | TypedMarker>> =
    this._visibleMapPointsOfInterest$.pipe(
      combineLatestWith(this.usagerCoordinates$),
      map(
        ([visibleMapPointsOfInterest, usagerCoordinates]: [
          Feature<Point, PointOfInterestMarkers>[],
          Coordinates | null
        ]): FeatureCollection<Point, PointOfInterestMarkers | TypedMarker> => ({
          features: addUsagerFeatureToMarkers(visibleMapPointsOfInterest, usagerCoordinates),
          type: 'FeatureCollection'
        })
      )
    );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public structuresList$: Observable<StructurePresentation[]> = this.presenter.structuresList$(
    this._visibleMapPointsOfInterest$
  );

  public constructor(
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  private handleCnfsByDepartmentMarkerEvents(markerEvent: MarkerEvent<PointOfInterestMarkers>): void {
    this.centerView = departmentMarkerEventToCenterView(
      markerEvent as MarkerEvent<MarkerProperties<CnfsByDepartmentProperties>>
    );
  }

  private handleCnfsByRegionMarkerEvents(markerEvent: MarkerEvent<PointOfInterestMarkers>): void {
    this.centerView = regionMarkerEventToCenterView(markerEvent as MarkerEvent<MarkerProperties<CnfsByRegionProperties>>);
  }

  private handleCnfsPermanenceMarkerEvents(markerEvent: MarkerEvent<PointOfInterestMarkers>): void {
    this.centerView = permanenceMarkerEventToCenterView(markerEvent as MarkerEvent<MarkerProperties<CnfsPermanenceProperties>>);
  }

  public autoLocateUsagerRequest(coordinates: Coordinates): void {
    this._usagerCoordinates$.next(coordinates);
  }

  public geocodeUsagerRequest(address: string): void {
    this._addressToGeocode$.next(address);
  }

  public mapViewChanged($event: ViewReset): void {
    this._mapViewportAndZoom$.next({ viewport: $event.viewport, zoomLevel: $event.zoomLevel });
  }

  public onMarkerChanged(markerEvent: MarkerEvent<PointOfInterestMarkers>): void {
    switch (markerEvent.markerProperties.markerType) {
      case Marker.CnfsPermanence:
        this.handleCnfsPermanenceMarkerEvents(markerEvent);
        break;
      case Marker.CnfsByRegion:
        this.handleCnfsByRegionMarkerEvents(markerEvent);
        break;
      case Marker.CnfsByDepartment:
        this.handleCnfsByDepartmentMarkerEvents(markerEvent);
        break;
      case Marker.Usager:
        break;
    }
  }
}
