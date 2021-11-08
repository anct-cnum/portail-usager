import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import type { MapFeatureModule } from '@features/map';

const ROUTES: Routes = [
  {
    children: [
      {
        loadChildren: async (): Promise<MapFeatureModule> =>
          (await import('@features/map')).MapFeatureModule,
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
