import { Component } from '@angular/core';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss'
})
export class MapDisplayComponent {
  marker = {
    name: 'Big Ben',
    coordinates: [51.5007, -0.1246] as [number, number]
  };

  onLocationSelected(selectedCoordinates: [number, number]): void {
    console.log('Selected Location:', selectedCoordinates);
    // Do something with the selected coordinates
  }
}
