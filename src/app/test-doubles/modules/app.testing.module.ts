import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderStubComponent } from '../components/header/header.component.stub';
import { MenuStubComponent } from '../components/main-navigation/menu/menu.component.stub';
import { SlugifyStubPipe } from '../pipes/slugify/slugify.pipe.stub';
import { FooterStubComponent } from '../components/footer/footer.component.stub';
import { DropdownPaneStubComponent } from '../components/dropdown-pane/dropdown-pane.component.stub';

@NgModule({
  declarations: [DropdownPaneStubComponent, FooterStubComponent, HeaderStubComponent, MenuStubComponent, SlugifyStubPipe],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
