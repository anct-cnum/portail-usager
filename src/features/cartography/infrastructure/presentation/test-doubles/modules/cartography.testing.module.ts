import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressGeolocationStubComponent,
  CnfsDetailsContactStubComponent,
  CnfsDetailsStubComponent,
  CnfsListStubComponent,
  IncompleteDataNoticeStubComponent,
  LeafletMapStubComponent,
  PermanenceAccessStubComponent,
  PermanenceAddressStubComponent,
  PermanenceCnfsInfoStubComponent,
  PermanenceCnfsListStubComponent,
  PermanenceMapStubComponent,
  PermanenceOpeningHoursStubComponent,
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
    PermanenceAccessStubComponent,
    PermanenceAddressStubComponent,
    PermanenceCnfsInfoStubComponent,
    PermanenceCnfsListStubComponent,
    PermanenceMapStubComponent,
    PermanenceOpeningHoursStubComponent,
    SwitchMapListStubComponent
  ],
  exports: [CnfsDetailsStubComponent],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
