import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartographyFeatureRoutingModule } from './cartography.feature-routing.module';
import { ListCnfsPositionUseCase } from '../../../use-cases';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CnfsRepository, CoordinatesRepository } from '../../../core';

import { MARKERS, MARKERS_TOKEN } from '../tokens';
import { CartographyPage } from '../../presentation/pages';
import { LeafletMapComponent } from '../../presentation/components';
import { ReactiveFormsModule } from '@angular/forms';
import { CnfsRest } from '../../data/rest';
import { CoordinatesRest } from '../../data/rest/coordinates';
import { GeocodeAddressUseCase } from '../../../use-cases/geocode-address/geocode-address.use-case';
import { LeafletMapStateChangeDirective } from '../../presentation/directives/leaflet-map-state-change';
import { ViewCullingPipe } from '../../presentation/pipes/view-culling.pipe';
import { ClusterService } from '../../presentation/services/cluster.service';
import { AddressGeolocationComponent } from '../../presentation/components/address-geolocation/address-geolocation.component';
import { AddUsagerMarker } from '../../presentation/pipes/add-usager-marker.pipe';
import { CnfsListComponent } from '../../presentation/components/cnfs-list/cnfs-list.component';

@NgModule({
  declarations: [
    AddressGeolocationComponent,
    AddUsagerMarker,
    CartographyPage,
    CnfsListComponent,
    LeafletMapComponent,
    LeafletMapStateChangeDirective,
    ViewCullingPipe
  ],
  imports: [CartographyFeatureRoutingModule, CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: MARKERS_TOKEN,
      useValue: MARKERS
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
      deps: [CoordinatesRest],
      provide: GeocodeAddressUseCase,
      useFactory: (coordinatesRepository: CoordinatesRepository): GeocodeAddressUseCase =>
        new GeocodeAddressUseCase(coordinatesRepository)
    }
  ]
})
export class CartographyFeatureModule {}
