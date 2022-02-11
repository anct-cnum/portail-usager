import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressGeolocationStubComponent,
  CnfsDetailsContactStubComponent,
  CnfsDetailsStubComponent,
  CnfsListStubComponent,
  IncompleteDataNoticeStubComponent,
  LeafletMapStubComponent,
  PermanenceMapStubComponent,
  SwitchMapListStubComponent
} from '../components';

@NgModule({
  declarations: [
    AddressGeolocationStubComponent,
    CnfsDetailsContactStubComponent,
    CnfsDetailsStubComponent,
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
