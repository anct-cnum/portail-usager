import { Inject, Injectable } from '@angular/core';
import {listCnfsByRegionToPresentation, cnfsCoreToPresentation, MarkersPresentation} from '../../models';
import { CnfsByRegionProperties, Coordinates } from '../../../../core';
import { map, Observable, switchMap } from 'rxjs';
import { ListCnfsByRegionUseCase, ListCnfsPositionUseCase } from '../../../../use-cases';
import { GeocodeAddressUseCase } from '../../../../use-cases/geocode-address/geocode-address.use-case';
import { Feature, FeatureCollection, Point } from 'geojson';
import { ClusterService } from '../../services/cluster.service';
import { AnyGeoJsonProperty } from '../../../../../../environments/environment.model';
import { combineLatestWith } from 'rxjs/operators';
import { ViewBox } from '../../directives/leaflet-map-state-change';
import { ViewCullingPipe } from '../../pipes/view-culling.pipe';
import { Marker } from '../../../configuration';
import { setMarkerIcon } from '../../pipes/marker-icon-helper';

@Injectable()
export class CartographyPresenter {
  // eslint-disable-next-line max-params
  public constructor(
    @Inject(ListCnfsPositionUseCase) private readonly listCnfsPositionUseCase: ListCnfsPositionUseCase,
    @Inject(ListCnfsByRegionUseCase) private readonly listCnfsByRegionUseCase: ListCnfsByRegionUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(ClusterService) private readonly clusterService: ClusterService
  ) {}

  public geocodeAddress$(addressToGeocode$: Observable<string>): Observable<Coordinates> {
    return addressToGeocode$.pipe(
      switchMap((address: string): Observable<Coordinates> => this.geocodeAddressUseCase.execute$(address))
    );
  }

  public listCnfsByRegionPositions$(): Observable<FeatureCollection<Point, CnfsByRegionProperties>> {
    return this.listCnfsByRegionUseCase.execute$().pipe(map(listCnfsByRegionToPresentation));
  }

  // Todo: split it
  // eslint-disable-next-line max-lines-per-function
  public listCnfsPositions$(viewBox$: Observable<ViewBox>): Observable<MarkersPresentation> {
    return this.listCnfsPositionUseCase.execute$().pipe(
      map(cnfsCoreToPresentation),
      combineLatestWith(viewBox$),
      map(([cnfsFeatureCollection, viewBox]: [FeatureCollection<Point, AnyGeoJsonProperty>, ViewBox]): MarkersPresentation => {
        if (!this.clusterService.isReady) this.clusterService.load(cnfsFeatureCollection.features);

        const visibleInMapViewport: FeatureCollection<Point, AnyGeoJsonProperty> = new ViewCullingPipe(
          this.clusterService
        ).transform(viewBox);
        const featuresVisibleInViewport: Feature<Point, AnyGeoJsonProperty>[] = visibleInMapViewport.features;
        const markerIcon: Marker = this.clusterService.getMarkerAtZoomLevel(viewBox.zoomLevel);

        return {
          features: featuresVisibleInViewport.map(setMarkerIcon(markerIcon)),
          type: 'FeatureCollection'
        };
      })
    );
  }
}
