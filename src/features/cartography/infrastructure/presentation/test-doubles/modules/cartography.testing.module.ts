import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressGeolocationStubComponent,
  CnfsListStubComponent,
  IncompleteDataNoticeStubComponent,
  LeafletMapStubComponent,
  PermanenceMapStubComponent,
  SwitchMapListStubComponent
} from '../components';

@NgModule({
  declarations: [
    AddressGeolocationStubComponent,
    CnfsListStubComponent,
    IncompleteDataNoticeStubComponent,
    LeafletMapStubComponent,
    PermanenceMapStubComponent,
    SwitchMapListStubComponent
  ],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
