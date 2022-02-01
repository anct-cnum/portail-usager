import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressGeolocationStubComponent,
  CnfsListStubComponent,
  LeafletMapStubComponent,
  PermanenceMapStubComponent,
  SwitchMapListStubComponent
} from '../components';

@NgModule({
  declarations: [
    AddressGeolocationStubComponent,
    CnfsListStubComponent,
    LeafletMapStubComponent,
    PermanenceMapStubComponent,
    SwitchMapListStubComponent
  ],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
