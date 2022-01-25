import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartographyFeatureRoutingModule } from './cartography.feature-routing.module';
import {
  CnfsDetailsUseCase,
  GeocodeAddressUseCase,
  ListCnfsByDepartmentUseCase,
  ListCnfsByRegionUseCase,
  ListCnfsUseCase,
  SearchAddressUseCase
} from '../../../use-cases';
import { CnfsRepository, Coordinates, AddressRepository } from '../../../core';
import { CARTOGRAPHY_TOKEN, MARKERS, MARKERS_TOKEN } from '../tokens';
import { CartographyPage } from '../../presentation/pages';
import {
  AddressGeolocationComponent,
  CnfsDetailsComponent,
  CnfsDetailsContactComponent,
  CnfsListComponent,
  DisplayMapComponent,
  LeafletMapComponent,
  PermanenceMapComponent
} from '../../presentation/components';
import { ReactiveFormsModule } from '@angular/forms';
import { CnfsRest } from '../../data/rest';
import { AddressRest } from '../../data/rest/coordinates';
import { LeafletMapStateChangeDirective } from '../../presentation/directives/leaflet-map-state-change';
import { MapViewCullingService } from '../../presentation/services/map-view-culling.service';

const METROPOLITAN_FRANCE_CENTER_LONGITUDE: number = 4.468874066180609;
const METROPOLITAN_FRANCE_CENTER_LATITUDE: number = 46.28146057911664;

@NgModule({
  declarations: [
    AddressGeolocationComponent,
    CartographyPage,
    CnfsDetailsComponent,
    CnfsDetailsContactComponent,
    CnfsListComponent,
    DisplayMapComponent,
    LeafletMapComponent,
    LeafletMapStateChangeDirective,
    PermanenceMapComponent
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
    AddressRest,
    CnfsRest,
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
      deps: [CnfsRest],
      provide: CnfsDetailsUseCase,
      useFactory: (cnfsRepository: CnfsRepository): CnfsDetailsUseCase => new CnfsDetailsUseCase(cnfsRepository)
    },
    {
      deps: [AddressRest],
      provide: GeocodeAddressUseCase,
      useFactory: (addressRepository: AddressRepository): GeocodeAddressUseCase => new GeocodeAddressUseCase(addressRepository)
    },
    {
      deps: [AddressRest],
      provide: SearchAddressUseCase,
      useFactory: (addressRepository: AddressRepository): SearchAddressUseCase => new SearchAddressUseCase(addressRepository)
    }
  ]
})
export class CartographyFeatureModule {}
