import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartographyFeatureModule } from '@features/cartography';
import { ContentLayout } from '../pages/layouts/content/content.layout';

const ROUTES: Routes = [
  {
    children: [
      {
        loadChildren: async (): Promise<CartographyFeatureModule> =>
          (await import('@features/cartography')).CartographyFeatureModule,
        path: ''
      }
    ],
    component: ContentLayout,
    path: ''
  },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(ROUTES)]
})
export class AppRoutingModule {}
