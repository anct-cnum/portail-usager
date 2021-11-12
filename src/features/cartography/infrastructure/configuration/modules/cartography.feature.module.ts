import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartographyFeatureRoutingModule } from './cartography.feature-routing.module';
import { ListCnfsPositionUseCase } from '../../../use-cases';
import type { CnfsRepository } from '../../../core';
import { CnfsRestTestDouble } from '../../../use-cases/test-doubles/cnfs-rest-test-double';
import { HttpClient } from '@angular/common/http';
import { MARKERS, MARKERS_TOKEN } from '../tokens';
import { CartographyPage } from '../../presentation/pages';
import { LeafletMapComponent } from '../../presentation/components';

@NgModule({
  declarations: [CartographyPage, LeafletMapComponent],
  imports: [CartographyFeatureRoutingModule, CommonModule],
  providers: [
    {
      provide: MARKERS_TOKEN,
      useValue: MARKERS
    },
    // TODO Remplacer par le vrai repository CnfsRest quand la route api-conseiller-numerique sera prête
    CnfsRestTestDouble,
    HttpClient,
    {
      deps: [CnfsRestTestDouble],
      provide: ListCnfsPositionUseCase,
      useFactory: (cnfsRepository: CnfsRepository): ListCnfsPositionUseCase => new ListCnfsPositionUseCase(cnfsRepository)
    }
  ]
})
export class CartographyFeatureModule {}
