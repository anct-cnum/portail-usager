import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressGeolocationStubComponent } from '../components/address-geolocation/address-geolocation.component.stub';
import { LeafletMapStubComponent } from '../components/leaflet-map/leaflet-map.component.stub';
import { CnfsListStubComponent } from '../components/cnfs-list/cnfs-list.component.stub';

@NgModule({
  declarations: [AddressGeolocationStubComponent, CnfsListStubComponent, LeafletMapStubComponent],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
