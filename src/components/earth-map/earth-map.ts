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
  @Input() toggleMap: boolean;
  mapLoaded = false;
  constructor() {
    console.log('Hello EarthMapComponent Component');
   
  }

  mapLoadedCallback() {
    this.mapLoaded = true;
  }


}
