import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartographyLayout, CnfsDetailsPage, CnfsListPage } from '../../presentation/pages';

export const ROUTES: Routes = [
  {
    children: [
      {
        component: CnfsDetailsPage,
        path: ':structureId/details'
      },
      {
        component: CnfsListPage,
        path: ':structureId'
      },
      {
        component: CnfsListPage,
        path: ''
      }
    ],
    component: CartographyLayout,
    path: ''
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class CartographyFeatureRoutingModule {}
