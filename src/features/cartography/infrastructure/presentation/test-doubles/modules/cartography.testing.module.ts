import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletMapStubComponent } from '../components';
import { AddressGeolocationStubComponent } from '../components/address-geolocation';

@NgModule({
  declarations: [AddressGeolocationStubComponent, LeafletMapStubComponent],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
