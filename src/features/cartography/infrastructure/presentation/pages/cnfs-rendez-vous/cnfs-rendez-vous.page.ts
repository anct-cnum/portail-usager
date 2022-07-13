import { Location as _Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CnfsRendezVous } from '@features/cartography/core/entities/cnfs-rendez-vous';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cnfs-rendez-vous.page.html'
})
export class CnfsRendezVousPage {

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly _location: _Location

  ) {}

  public async backToPreviousPage(): Promise<void> {
    const stateRouteRendezVous: CnfsRendezVous = this._location.getState() as CnfsRendezVous
    if (stateRouteRendezVous.suffixPreviousUrl == null) {
      await this.router.navigateByUrl(`/${stateRouteRendezVous.structureId}`);
    } else {
      await this.router.navigateByUrl(`/${stateRouteRendezVous.structureId}${stateRouteRendezVous.suffixPreviousUrl}`);
    }
  }
}
