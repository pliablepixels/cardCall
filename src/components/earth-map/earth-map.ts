import { Component, Input} from '@angular/core';
import {  MapAnimation } from '../../animations/animations';

@Component({
  selector: 'earth-map',
  templateUrl: 'earth-map.html',
  animations: [
    MapAnimation

  ]
})
export class EarthMapComponent {
  // if you do ngIf in parent (view), then leave animation
  // of child is not called, so changed it to an input
  @Input() toggleMap: boolean;
  mapLoaded = false;
  constructor() {
  }

  mapLoadedCallback() {
    this.mapLoaded = true;
  }


}
