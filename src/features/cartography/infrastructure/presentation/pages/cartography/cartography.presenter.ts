import { Inject, Injectable } from '@angular/core';
import {
  AddressFoundPresentation,
  CnfsDetailsPresentation,
  cnfsDetailsToPresentation,
  StructurePresentation,
  CenterView,
  MarkerHighLight,
  CnfsLocationPresentation,
  CnfsPermanenceProperties,
  CnfsPermanenceMarkerProperties,
  cnfsPositionTransferToPresentation,
  toStructurePresentation
} from '../../models';
import { CnfsDetails, Coordinates } from '../../../../core';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { CnfsDetailsUseCase, GeocodeAddressUseCase, SearchAddressUseCase } from '../../../../use-cases';
import { CnfsRest } from '../../../data/rest';
import { CnfsLocationTransfer } from '../../../data/models';

export interface HighlightedStructure {
  id: string;
  type: MarkerHighLight;
}

@Injectable()
export class CartographyPresenter {
  private readonly _centerView$: Subject<CenterView> = new Subject<CenterView>();

  private readonly _cnfsPermanenceMarkerProperties$: BehaviorSubject<CnfsPermanenceProperties[]> = new BehaviorSubject<
    CnfsPermanenceProperties[]
  >([]);

  private readonly _displayStructureDetails$: Subject<boolean> = new Subject<boolean>();

  private readonly _geocodeAddressError$: Subject<boolean> = new Subject<boolean>();

  private readonly _highlightedStructure$: BehaviorSubject<HighlightedStructure | null> =
    new BehaviorSubject<HighlightedStructure | null>(null);

  private _usagerCoordinates?: Coordinates;

  public centerView$: Observable<CenterView> = this._centerView$.asObservable();

  public displayStructureDetails$: Observable<boolean> = this._displayStructureDetails$.asObservable();

  public geocodeAddressError$: Observable<boolean> = this._geocodeAddressError$.asObservable();

  public highlightedStructure$: Observable<HighlightedStructure> = this._highlightedStructure$.pipe(
    filter(
      (highlightedStructure: HighlightedStructure | null): highlightedStructure is HighlightedStructure =>
        highlightedStructure !== null
    )
  );

  public constructor(
    @Inject(CnfsDetailsUseCase) private readonly cnfsDetailsUseCase: CnfsDetailsUseCase,
    @Inject(GeocodeAddressUseCase) private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    @Inject(SearchAddressUseCase) private readonly searchAddressUseCase: SearchAddressUseCase,
    @Inject(CnfsRest) private readonly cnfsRest: CnfsRest
  ) {}

  public clearStructureHighlight(): void {
    this._highlightedStructure$.next({
      id: '',
      type: MarkerHighLight.Hint
    });
  }

  public cnfsDetails$(id: string): Observable<CnfsDetailsPresentation> {
    return this.cnfsDetailsUseCase
      .execute$(id)
      .pipe(
        map(
          (cnfsDetails: CnfsDetails): CnfsDetailsPresentation => cnfsDetailsToPresentation(cnfsDetails, this._usagerCoordinates)
        )
      );
  }

  public cnfsPosition$(id: string): Observable<CnfsLocationPresentation> {
    return this.cnfsRest
      .cnfsLocation$(id)
      .pipe(
        map(
          (cnfsLocation: CnfsLocationTransfer): CnfsLocationPresentation => cnfsPositionTransferToPresentation(cnfsLocation, id)
        )
      );
  }

  public focusStructure(structureId: string): void {
    this._highlightedStructure$.next({
      id: structureId,
      type: MarkerHighLight.Focus
    });
  }

  public geocodeAddress$(addressToGeocode: string): Observable<Coordinates> {
    return this.geocodeAddressUseCase.execute$(addressToGeocode);
  }

  public hintStructure(structureId: string): void {
    this._highlightedStructure$.next({
      id: structureId,
      type: MarkerHighLight.Hint
    });
  }

  public searchAddress$(searchTerm: string): Observable<AddressFoundPresentation[]> {
    return this.searchAddressUseCase.execute$(searchTerm);
  }

  public setCnfsPermanences(cnfsPermanenceMarkerProperties: CnfsPermanenceMarkerProperties[]): void {
    this._cnfsPermanenceMarkerProperties$.next(cnfsPermanenceMarkerProperties);
  }

  public setGeocodeAddressError(geocodeAddressError: boolean): void {
    this._geocodeAddressError$.next(geocodeAddressError);
  }

  public setMapView(coordinates: Coordinates, zoomLevel: number): void {
    this._centerView$.next({ coordinates, zoomLevel });
  }

  public setStructureDetailsDisplay(display: boolean): void {
    this._displayStructureDetails$.next(display);
  }

  public setUsagerCoordinates(usagerCoordinates: Coordinates): void {
    this._usagerCoordinates = usagerCoordinates;
  }

  public structuresList$(): Observable<StructurePresentation[]> {
    return this._cnfsPermanenceMarkerProperties$
      .asObservable()
      .pipe(
        map((cnfsPermanenceProperties: CnfsPermanenceProperties[]): StructurePresentation[] =>
          toStructurePresentation(cnfsPermanenceProperties, this._usagerCoordinates)
        )
      );
  }
}
