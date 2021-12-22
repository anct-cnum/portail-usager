import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CenterView, MarkerEvent, MarkersPresentation, StructurePresentation } from '../../models';
import { CartographyPresenter, coordinatesToCenterView, markerEventToCenterView } from './cartography.presenter';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, tap } from 'rxjs';
import { Coordinates } from '../../../../core';
import { ViewBox, ViewReset } from '../../directives/leaflet-map-state-change';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN } from '../../../configuration';
import { map } from 'rxjs/operators';

// TODO Inject though configuration token
const DEFAULT_VIEW_BOX: ViewBox = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  boundingBox: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const SPLIT_REGION_ZOOM: number = 8;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
export class CartographyPage {
  private readonly _addressToGeocode$: Subject<string> = new Subject<string>();

  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  private readonly _viewBox$: Subject<ViewBox> = new BehaviorSubject<ViewBox>(DEFAULT_VIEW_BOX);

  public centerView: CenterView = this.cartographyConfiguration;

  public structuresList$: Observable<StructurePresentation[]> = this.presenter.structuresList$();

  public readonly usagerCoordinates$: Observable<Coordinates> = merge(
    this.presenter.geocodeAddress$(this._addressToGeocode$),
    this._usagerCoordinates$
  ).pipe(
    tap((coordinates: Coordinates): void => {
      this.centerView = coordinatesToCenterView(coordinates);
    })
  );

  public readonly visibleMarkers$: Observable<MarkersPresentation> = combineLatest([
    this.presenter.listCnfsByRegionPositions$(),
    this.presenter.listCnfsPositions$(this._viewBox$),
    this._viewBox$ as Observable<ViewBox>
  ]).pipe(
    map(
      ([byRegionPosition, allCnfsPosition, viewBox]: [
        MarkersPresentation,
        MarkersPresentation,
        ViewBox
      ]): MarkersPresentation => (viewBox.zoomLevel < SPLIT_REGION_ZOOM ? byRegionPosition : allCnfsPosition)
    )
  );

  public constructor(
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  public autoLocateUsagerRequest(coordinates: Coordinates): void {
    this._usagerCoordinates$.next(coordinates);
  }

  public geocodeUsagerRequest(address: string): void {
    this._addressToGeocode$.next(address);
  }

  public mapViewChanged($event: ViewReset): void {
    this._viewBox$.next({ boundingBox: $event.boundingBox, zoomLevel: $event.zoomLevel });
  }

  public onMarkerChanged(markerEvent: MarkerEvent): void {
    this.centerView = markerEventToCenterView(markerEvent);
  }
}
