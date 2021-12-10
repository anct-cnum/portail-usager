// TODO REVIEW IGNORE
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapOptionsPresentation, MarkersPresentation, MarkerProperties, CenterView, MarkerEvent } from '../../models';
import { CartographyPresenter } from './cartography.presenter';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Coordinates } from '../../../../core';
import { ViewBox, ViewReset } from '../../directives/leaflet-map-state-change';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { ViewCullingPipe } from '../../pipes/view-culling.pipe';
import { combineLatestWith, map } from 'rxjs/operators';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';
import { setMarkerIcon } from '../../pipes/marker-icon-helper';

// TODO Inject though configuration token
const DEFAULT_VIEW_BOX: ViewBox = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  boundingBox: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const ZOOM_LEVEL_USAGER_POSITION: number = 10;
const ZOOM_LEVEL_REGIONAL_MARKER: number = 8;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
// eslint-disable-next-line
export class CartographyPage {
  private readonly _centerView$: Subject<CenterView> = new Subject<CenterView>();

  private readonly _cnfsMarkers$: BehaviorSubject<MarkersPresentation> = new BehaviorSubject<MarkersPresentation>({
    features: [],
    type: 'FeatureCollection'
  });

  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  // TODO Init with token configuration
  private readonly _viewBox$: BehaviorSubject<ViewBox> = new BehaviorSubject<ViewBox>(DEFAULT_VIEW_BOX);

  private readonly _visibleMarkers$: BehaviorSubject<MarkersPresentation> = new BehaviorSubject<MarkersPresentation>({
    features: [],
    type: 'FeatureCollection'
  });

  public readonly centerView$: Observable<CenterView> = this._centerView$.asObservable();

  public readonly mapOptions: MapOptionsPresentation;

  public readonly usagerCoordinates$: Observable<Coordinates> = this._usagerCoordinates$.asObservable();

  public readonly viewBox$: Observable<ViewBox> = this._viewBox$.asObservable();

  public readonly visibleMarkers$: Observable<MarkersPresentation> = this._visibleMarkers$.asObservable();

  // eslint-disable-next-line max-lines-per-function
  public constructor(private readonly presenter: CartographyPresenter) {
    this.mapOptions = presenter.defaultMapOptions();

    // TODO Remove subscribe and use async pipe
    presenter
      .listCnfsPositions$()
      .pipe(
        combineLatestWith(this.viewBox$),
        map(([cnfsFeatureCollection, viewBox]: [FeatureCollection<Point, AnyGeoJsonProperty>, ViewBox]): void => {
          if (!this.presenter.clusterService.isReady) presenter.clusterService.load(cnfsFeatureCollection.features);

          const visibleInMapViewport: FeatureCollection<Point, AnyGeoJsonProperty> = new ViewCullingPipe(
            presenter.clusterService
          ).transform(viewBox);
          const featuresVisibleInViewport: Feature<Point, AnyGeoJsonProperty>[] = visibleInMapViewport.features;
          const markerIcon: Marker = presenter.clusterService.getMarkerAtZoomLevel(viewBox.zoomLevel);
          const markersVisibleInViewport: Feature<Point, MarkerProperties>[] = featuresVisibleInViewport.map(
            setMarkerIcon(markerIcon)
          );
          this._visibleMarkers$.next({
            features: markersVisibleInViewport,
            type: 'FeatureCollection'
          });
        })
      )
      // eslint-disable-next-line
      .subscribe();
  }

  public centerView(centerView: CenterView): void {
    this._centerView$.next(centerView);
  }

  public geocodeUsagerPosition($event: string): void {
    // eslint-disable-next-line
    this.presenter.geocodeAddress$($event).subscribe((usagerCoordinates: Coordinates): void => {
      this.updateUsagerPosition(usagerCoordinates);
    });
  }

  public mapViewChanged($event: ViewReset): void {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this._viewBox$.next({ boundingBox: $event.boundingBox, zoomLevel: $event.zoomLevel } as ViewBox);
  }

  public markerEvent($event: MarkerEvent): void {
    if ($event.eventType === 'click') {
      this._centerView$.next({
        coordinates: $event.markerPosition,
        zoomLevel: ($event.markerProperties['zoomLevel'] ?? ZOOM_LEVEL_REGIONAL_MARKER) as number
      });
    } else {
      // eslint-disable-next-line no-console
      console.log(`MarkerEvent type not handled : ${$event.eventType}`);
    }
  }

  public updateUsagerPosition($event: Coordinates): void {
    this._usagerCoordinates$.next($event);
    this.centerView({ coordinates: $event, zoomLevel: ZOOM_LEVEL_USAGER_POSITION });
  }
}
