import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartographyFeatureRoutingModule } from './cartography.feature-routing.module';
import { ListCnfsByRegionUseCase, ListCnfsByDepartmentUseCase, ListCnfsUseCase } from '../../../use-cases';
import { CnfsRepository, Coordinates, CoordinatesRepository } from '../../../core';
import { CARTOGRAPHY_TOKEN, MARKERS, MARKERS_TOKEN } from '../tokens';
import { CartographyPage } from '../../presentation/pages';
import { DisplayMapComponent, LeafletMapComponent } from '../../presentation/components';
import { ReactiveFormsModule } from '@angular/forms';
import { CnfsRest } from '../../data/rest';
import { CoordinatesRest } from '../../data/rest/coordinates';
import { GeocodeAddressUseCase } from '../../../use-cases/geocode-address/geocode-address.use-case';
import { LeafletMapStateChangeDirective } from '../../presentation/directives/leaflet-map-state-change';
import { MapViewCullingService } from '../../presentation/services/map-view-culling.service';
import { AddressGeolocationComponent } from '../../presentation/components/address-geolocation/address-geolocation.component';
import { CnfsListComponent } from '../../presentation/components/cnfs-list/cnfs-list.component';

const METROPOLITAN_FRANCE_CENTER_LONGITUDE: number = 4.468874066180609;
const METROPOLITAN_FRANCE_CENTER_LATITUDE: number = 46.28146057911664;

@NgModule({
  declarations: [
    AddressGeolocationComponent,
    CartographyPage,
    CnfsListComponent,
    DisplayMapComponent,
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
        coordinates: new Coordinates(METROPOLITAN_FRANCE_CENTER_LATITUDE, METROPOLITAN_FRANCE_CENTER_LONGITUDE),
        zoomLevel: 6
      }
    },
    CnfsRest,
    CoordinatesRest,
    {
      provide: MapViewCullingService,
      useClass: MapViewCullingService
    },
    {
      deps: [CnfsRest],
      provide: ListCnfsUseCase,
      useFactory: (cnfsRepository: CnfsRepository): ListCnfsUseCase => new ListCnfsUseCase(cnfsRepository)
    },
    {
      deps: [CnfsRest],
      provide: ListCnfsByDepartmentUseCase,
      useFactory: (cnfsRepository: CnfsRepository): ListCnfsByDepartmentUseCase =>
        new ListCnfsByDepartmentUseCase(cnfsRepository)
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
