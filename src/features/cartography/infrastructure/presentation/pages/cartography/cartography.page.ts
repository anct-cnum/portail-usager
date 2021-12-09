// TODO REVIEW IGNORE
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { featureGeoJsonToMarker, MapOptionsPresentation, MarkersPresentation, MarkerProperties } from '../../models';
import { CartographyPresenter } from './cartography.presenter';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Coordinates } from '../../../../core';
import { ViewBox, ViewReset } from '../../directives/leaflet-map-state-change';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';
import { ViewCullingPipe } from '../../pipes/view-culling.pipe';
import { combineLatestWith, map } from 'rxjs/operators';

// TODO Inject though configuration token
const DEFAULT_VIEW_BOX: ViewBox = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  boundingBox: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
// eslint-disable-next-line
export class CartographyPage {
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

  public readonly cnfsMarkers$: Observable<MarkersPresentation> = this._cnfsMarkers$.asObservable();

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
        map(([cnfsMarkers, viewBox]: [FeatureCollection<Point>, ViewBox]): void => {
          if (!presenter.clusterService.isReady) {
            presenter.clusterService.load(
              cnfsMarkers.features.map(
                (feature: Feature<Point>): Feature<Point, MarkerProperties> =>
                  featureGeoJsonToMarker(feature, Marker.CnfsCluster)
              )
            );
          }

          this._visibleMarkers$.next(new ViewCullingPipe(presenter.clusterService).transform(viewBox));
        })
      )
      // eslint-disable-next-line
      .subscribe();
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

  public updateUsagerPosition($event: Coordinates): void {
    this._usagerCoordinates$.next($event);
  }
}
