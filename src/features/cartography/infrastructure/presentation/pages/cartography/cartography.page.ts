// TODO REVIEW IGNORE
import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { MapOptionsPresentation, MarkersPresentation, MarkerProperties } from '../../models';
import { featureGeoJsonToMarker } from '../../models';
import { CartographyPresenter } from './cartography.presenter';
import type { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import type { Coordinates } from '../../../../core';
import type { ViewBox, ViewReset } from '../../directives/leaflet-map-state-change';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { Marker } from '../../../configuration';

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

  public readonly cnfsMarkers$: Observable<MarkersPresentation> = this._cnfsMarkers$.asObservable();

  public readonly mapOptions: MapOptionsPresentation;

  public readonly usagerCoordinates$: Observable<Coordinates> = this._usagerCoordinates$.asObservable();

  public readonly viewBox$: Observable<ViewBox> = this._viewBox$.asObservable();

  public constructor(private readonly presenter: CartographyPresenter) {
    this.mapOptions = this.presenter.defaultMapOptions();

    // eslint-disable-next-line
    this.presenter.listCnfsPositions$().subscribe((cnfs: FeatureCollection<Point>): void => {
      this.presenter.clusterService.load(
        cnfs.features.map(
          (feature: Feature<Point>): Feature<Point, MarkerProperties> => featureGeoJsonToMarker(feature, Marker.CnfsCluster)
        )
      );
      this._viewBox$.next({ ...DEFAULT_VIEW_BOX });
    });
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
