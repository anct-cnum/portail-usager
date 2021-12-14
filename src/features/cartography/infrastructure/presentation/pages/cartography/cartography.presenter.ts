import { Inject, Injectable } from '@angular/core';
import {
  listCnfsByRegionToPresentation,
  cnfsCoreToPresentation,
  MarkersPresentation,
  MarkerProperties,
  EMPTY_FEATURE_COLLECTION
} from '../../models';
import { Coordinates } from '../../../../core';
import { map, Observable, switchMap } from 'rxjs';
import { ListCnfsByRegionUseCase, ListCnfsPositionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { Feature, FeatureCollection, Point } from 'geojson';
import { ClusterService } from '../../services/cluster.service';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';
import { combineLatestWith } from 'rxjs/operators';
import { ViewBox } from '../../directives/leaflet-map-state-change';
import { setMarkerIcon } from '../../pipes/marker-icon-helper';

@Injectable()
export class CartographyPresenter {
  public constructor(
    @Inject(ListCnfsPositionUseCase) private readonly listCnfsPositionUseCase: ListCnfsPositionUseCase,
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(ClusterService) private readonly clusterService: ClusterService
  ) {}

  private onlyVisibleMarkers(): ([cnfsFeatureCollection, viewBox]: [
    FeatureCollection<Point, AnyGeoJsonProperty>,
    ViewBox
  ]) => MarkersPresentation {
    return ([cnfsFeatureCollection, viewBox]: [FeatureCollection<Point, AnyGeoJsonProperty>, ViewBox]): MarkersPresentation => {
      if (!this.clusterService.isReady) this.clusterService.load(cnfsFeatureCollection.features);

      return {
        features: this.viewCulling(viewBox).features.map(this.selectMarkerAtZoomLevel(viewBox)),
        type: 'FeatureCollection'
      };
    };
  }

  private selectMarkerAtZoomLevel(viewBox: ViewBox): (feature: Feature<Point, AnyGeoJsonProperty>) => Feature<Point, MarkerProperties> {
    return setMarkerIcon(this.clusterService.getMarkerAtZoomLevel(viewBox.zoomLevel));
  }

  public geocodeAddress$(addressToGeocode$: Observable<string>): Observable<Coordinates> {
    return addressToGeocode$.pipe(
      switchMap((address: string): Observable<Coordinates> => this.geocodeAddressUseCase.execute$(address))
    );
  }

  public listCnfsByRegionPositions$(): Observable<FeatureCollection<Point, MarkerProperties>> {
    return this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation));
  }

  public listCnfsPositions$(viewBox$: Observable<ViewBox>): Observable<MarkersPresentation> {
    return this.listCnfsPositionUseCase
      .execute$()
      .pipe(map(cnfsCoreToPresentation), combineLatestWith(viewBox$), map(this.onlyVisibleMarkers()));
  }

  public viewCulling(viewBox?: ViewBox | null): FeatureCollection<Point, AnyGeoJsonProperty> {
    if (viewBox == null || !this.clusterService.isReady) return EMPTY_FEATURE_COLLECTION;

    return {
      features: this.viewCullingGetFinalFeatures(viewBox),
      type: 'FeatureCollection'
    };
  }

  public viewCullingGetClusterLeaves(cluster: Feature<Point, AnyGeoJsonProperty>): Feature<Point, AnyGeoJsonProperty>[] {
    if (cluster.properties['cluster'] === true) return this.clusterService.index.getLeaves(Number(cluster.id), Infinity);
    return [cluster];
  }

  public viewCullingGetFinalFeatures(viewbox: ViewBox): Feature<Point, AnyGeoJsonProperty>[] {
    return this.viewCullingGetFinalMarkersPositions(viewbox);
  }

  public viewCullingGetFinalMarkersPositions(viewbox: ViewBox): Feature<Point, AnyGeoJsonProperty>[] {
    const clustersForViewbox: Feature<Point, AnyGeoJsonProperty>[] = this.clusterService.index.getClusters(
      viewbox.boundingBox,
      viewbox.zoomLevel
    );

    if (this.clusterService.exceedClusterZoomLevel(viewbox.zoomLevel)) {
      return clustersForViewbox.flatMap((cluster: Feature<Point, AnyGeoJsonProperty>): Feature<Point, AnyGeoJsonProperty>[] =>
        this.viewCullingGetClusterLeaves(cluster)
      );
    }

    return clustersForViewbox;
  }
}
