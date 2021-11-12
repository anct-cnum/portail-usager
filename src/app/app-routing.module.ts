import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import type { CartographyFeatureModule } from '@features/cartography';

const ROUTES: Routes = [
  {
    children: [
      {
        loadChildren: async (): Promise<CartographyFeatureModule> =>
          (await import('@features/cartography')).CartographyFeatureModule,
        path: ''
      }
    ],
    path: ''
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(ROUTES)]
})
export class AppRoutingModule {}
