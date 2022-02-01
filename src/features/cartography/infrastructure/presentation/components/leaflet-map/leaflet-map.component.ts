import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import { initializeMap, setView } from './leaflet-map.presenter';
import { CenterView } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'leaflet-map',
  templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements OnInit {
  private _map?: LeafletMap;

  @Output() public readonly mapClick: EventEmitter<LeafletMouseEvent> = new EventEmitter<LeafletMouseEvent>();

  /* prettier-ignore */
  @ViewChild('map', { 'static': true }) public mapContainer!: ElementRef<HTMLElement>;

  public get map(): LeafletMap | undefined {
    return this._map;
  }

  @Input() public set centerView(centerView: CenterView | undefined) {
    this._map != null && setView(this._map, centerView);
  }

  public ngOnInit(): void {
    this._map = initializeMap(this.mapContainer.nativeElement);
    this._map.on('click', (leafletMouseEvent: LeafletMouseEvent): void => this.mapClick.next(leafletMouseEvent));
  }
}
