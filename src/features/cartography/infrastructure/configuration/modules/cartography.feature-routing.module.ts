import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartographyPage } from '../../presentation/pages';

export const ROUTES: Routes = [
  {
    component: CartographyPage,
    path: ''
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class CartographyFeatureRoutingModule {}
