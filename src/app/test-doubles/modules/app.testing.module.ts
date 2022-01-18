import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderStubComponent } from '../components/header/header.component.stub';
import { MenuStubComponent } from '../components/main-navigation/menu/menu.component.stub';
import { SlugifyStubPipe } from '../pipes/slugify/slugify.pipe.stub';

@NgModule({
  declarations: [HeaderStubComponent, MenuStubComponent, SlugifyStubPipe],
  imports: [CommonModule],
  providers: []
})
export class CartographyTestingModule {}
