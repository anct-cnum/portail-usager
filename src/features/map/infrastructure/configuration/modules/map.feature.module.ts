import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapFeatureRoutingModule } from './map.feature-routing.module';
import { MapPage } from '../../presentation';

/**
 * Configure lazy loaded part of the Map features.
 */
@NgModule({
  declarations: [MapPage],
  imports: [CommonModule, MapFeatureRoutingModule],
  providers: []
})
export class MapFeatureModule {}
