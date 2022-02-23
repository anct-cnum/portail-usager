import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { AddressFoundPresentation, StructurePresentation } from '../../models';
import { map } from 'rxjs/operators';
import { Coordinates } from '../../../../core';
import { CartographyPresenter } from '../cartography';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CARTOGRAPHY_TOKEN, CartographyConfiguration } from '../../../configuration';

const MIN_SEARCH_TERM_LENGTH: number = 3;

const SEARCH_DEBOUNCE_TIME: number = 300;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cnfs-list.page.html'
})
export class CnfsListPage implements OnInit {
  private readonly _searchTerm$: Subject<string> = new Subject<string>();

  private readonly _structureId$: Observable<string> = this.route.paramMap.pipe(
    map((params: ParamMap): string | null => params.get('structureId')),
    filter((structureId: string | null): structureId is string => structureId !== null),
    tap((): void => this.presenter.focusStructure(''))
  );

  public addressesFound$: Observable<AddressFoundPresentation[]> = this._searchTerm$.pipe(
    map((searchTerm: string): string => searchTerm.trim()),
    filter((searchTerm: string): boolean => searchTerm.length >= MIN_SEARCH_TERM_LENGTH),
    debounceTime(SEARCH_DEBOUNCE_TIME),
    distinctUntilChanged(),
    switchMap((searchTerm: string): Observable<AddressFoundPresentation[]> => this.presenter.searchAddress$(searchTerm))
  );

  public geocodeAddressError$: Observable<boolean> = this.presenter.geocodeAddressError$;

  public highlightedStructureId$: Observable<string | null> = this._structureId$;

  public structuresList$: Observable<StructurePresentation[]> = this._structureId$.pipe(
    startWith([]),
    switchMap((): Observable<StructurePresentation[]> => this.presenter.structuresList$())
  );

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  public ngOnInit(): void {
    this.presenter.setStructureDetailsDisplay(false);
  }

  public async onAutoLocateUsagerRequest({ latitude, longitude }: Coordinates): Promise<void> {
    await this.router.navigate([], {
      queryParams: { latitude, longitude }
    });
  }

  public async onGeocodeUsagerRequest(address: string): Promise<void> {
    await this.router.navigate([], {
      queryParams: { address }
    });
  }

  public onHintAStructure(structureId: string): void {
    this.presenter.hintStructure(structureId);
  }

  public onSearchAddress(searchTerm: string): void {
    this._searchTerm$.next(searchTerm);
  }
}
