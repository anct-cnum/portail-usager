import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartographyFeatureRoutingModule } from './cartography.feature-routing.module';
import { ListCnfsByRegionUseCase, ListCnfsPositionUseCase } from '../../../use-cases';
import { CnfsRepository, CoordinatesRepository } from '../../../core';
import { MARKERS, MARKERS_TOKEN } from '../tokens';
import { CartographyPage } from '../../presentation/pages';
import { LeafletMapComponent } from '../../presentation/components';
import { ReactiveFormsModule } from '@angular/forms';
import { CnfsRest } from '../../data/rest';
import { CoordinatesRest } from '../../data/rest/coordinates';
import { GeocodeAddressUseCase } from '../../../use-cases/geocode-address/geocode-address.use-case';
import { LeafletMapStateChangeDirective } from '../../presentation/directives/leaflet-map-state-change';
import { ClusterService } from '../../presentation/services/cluster.service';
import { AddressGeolocationComponent } from '../../presentation/components/address-geolocation/address-geolocation.component';
import { AddUsagerMarker } from '../../presentation/pipes/add-usager-marker.pipe';
import { CnfsListComponent } from '../../presentation/components/cnfs-list/cnfs-list.component';
import { CARTOGRAPHY_TOKEN } from '../tokens/cartography/cartography.token';
import { Point } from 'geojson';

const DEFAULT_LONGITUDE: number = 4;
const DEFAULT_LATITUDE: number = 45;
const DEFAULT_POSITION: Point = {
  coordinates: [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
  type: 'Point'
};
@NgModule({
  declarations: [
    AddressGeolocationComponent,
    AddUsagerMarker,
    CartographyPage,
    CnfsListComponent,
    LeafletMapComponent,
    LeafletMapStateChangeDirective
  ],
  imports: [CartographyFeatureRoutingModule, CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: MARKERS_TOKEN,
      useValue: MARKERS
    },
    {
      provide: CARTOGRAPHY_TOKEN,
      useValue: {
        center: DEFAULT_POSITION,
        zoomLevel: 6
      }
    },
    CnfsRest,
    CoordinatesRest,
    {
      provide: ClusterService,
      useClass: ClusterService
    },
    {
      deps: [CnfsRest],
      provide: ListCnfsPositionUseCase,
      useFactory: (cnfsRepository: CnfsRepository): ListCnfsPositionUseCase => new ListCnfsPositionUseCase(cnfsRepository)
    },
    {
      deps: [CnfsRest],
      provide: ListCnfsByRegionUseCase,
      useFactory: (cnfsRepository: CnfsRepository): ListCnfsByRegionUseCase => new ListCnfsByRegionUseCase(cnfsRepository)
    },
    {
      deps: [CoordinatesRest],
      provide: GeocodeAddressUseCase,
      useFactory: (coordinatesRepository: CoordinatesRepository): GeocodeAddressUseCase =>
        new GeocodeAddressUseCase(coordinatesRepository)
    }
  ]
})
export class CartographyFeatureModule {}
