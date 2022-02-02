import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Coordinates } from '../../../../core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressFoundPresentation } from '../../models';

// TODO geocode et locate sont deux sujets différents qu'il serait bien de séparer dans des composants dédiés

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'address-geolocation',
  templateUrl: './address-geolocation.component.html'
})
export class AddressGeolocationComponent {
  public readonly searchForm: FormGroup = new FormGroup({
    address: new FormControl('')
  });

  @Input() public addressSuggestions: AddressFoundPresentation[] = [];

  @Output() public readonly addressToGeocode: EventEmitter<string> = new EventEmitter<string>();

  @Input() public geocodeAddressError: boolean = false;

  @Output() public readonly searchAddress: EventEmitter<string> = new EventEmitter<string>();

  @Output() public readonly usagerAutolocate: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  public emitLocation(position: GeolocationPosition): void {
    this.usagerAutolocate.emit(new Coordinates(position.coords.latitude, position.coords.longitude));
  }

  public geocode(): void {
    this.addressToGeocode.emit(this.searchForm.get('address')?.value as string);
  }

  public locate(): void {
    // Todo: move to address-geolocation presenter
    const webapisService: Navigator = window.navigator;
    webapisService.geolocation.getCurrentPosition(
      (position: GeolocationPosition): void => {
        this.emitLocation(position);
      },
      (error: GeolocationPositionError): void => {
        // eslint-disable-next-line no-alert
        alert(`Nous n'avons pas réussi à vous localiser : ${error.message}`);
      }
    );
  }

  public search(addressInput: string): void {
    this.searchAddress.next(addressInput);
  }

  public setAddressSuggestion(label: string): void {
    this.searchForm.get('address')?.setValue(label);
    this.geocode();
  }

  public trackByAddressName(_: number, address: AddressFoundPresentation): string {
    return `${address.label}-${address.context}`;
  }
}
