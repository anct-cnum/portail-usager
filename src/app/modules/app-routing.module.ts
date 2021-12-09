import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartographyFeatureModule } from '@features/cartography';
import { ContentLayout } from '../pages/layouts/content/content.layout';
import { HomePage } from '../pages/home/home.page';

const ROUTES: Routes = [
  {
    children: [
      {
        component: HomePage,
        path: ''
      }
    ],
    component: ContentLayout,
    path: ''
  },
  {
    children: [
      {
        loadChildren: async (): Promise<CartographyFeatureModule> =>
          (await import('@features/cartography')).CartographyFeatureModule,
        path: ''
      }
    ],
    component: ContentLayout,
    path: 'cartographie'
  },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(ROUTES)]
})
export class AppRoutingModule {}
