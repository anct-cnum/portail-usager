import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressGeolocationStubComponent,
  CnfsListStubComponent,
  DisplayMapStubComponent,
  LeafletMapStubComponent,
  PermanenceMapStubComponent
} from '../components';

@NgModule({
  declarations: [
    AddressGeolocationStubComponent,
    CnfsListStubComponent,
    DisplayMapStubComponent,
    LeafletMapStubComponent,
    PermanenceMapStubComponent
  ],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
