import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Coordinates } from '../../../../core';
import { FormControl } from '@angular/forms';

// TODO geocode et locate sont deux sujets différents qu'il serait bien de séparer dans des composants dédiés

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'address-geolocation',
  templateUrl: './address-geolocation.component.html'
})
export class AddressGeolocationComponent {
  public readonly address: FormControl = new FormControl('');

  @Output() public readonly addressToGeocode: EventEmitter<string> = new EventEmitter<string>();
  @Output() public readonly usagerAutolocate: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  public emitLocation(position: GeolocationPosition): void {
    this.usagerAutolocate.emit(new Coordinates(position.coords.latitude, position.coords.longitude));
  }

  public geocode(): void {
    this.addressToGeocode.emit(this.address.value as string);
  }

  public locate(): void {
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
}
