import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MapPage } from '@features/map/infrastructure/presentation';

export const ROUTES: Routes = [
  {
    component: MapPage,
    path: ''
  }
];

/**
 * Configure map feature routes.
 */
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)]
})
export class MapFeatureRoutingModule {}
