import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartographyLayout, CnfsDetailsPage, CnfsListPage, CnfsRendezVousPage } from '../../presentation/pages';

export const ROUTES: Routes = [
  {
    component: CnfsRendezVousPage,
    path: 'liste/rendez-vous'
  },
  {
    component: CnfsRendezVousPage,
    path: 'details/rendez-vous'
  },
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
