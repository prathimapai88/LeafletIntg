import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements OnInit, OnChanges {
  private map: L.Map | undefined;

  // Declare markerData as an input property without default values
  @Input() markerData?: { name: string; coordinates: [number, number] };

  ngOnInit(): void {
    this.initMap();
    if (this.markerData) {
      this.addMarker();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markerData'] && !changes['markerData'].isFirstChange() && this.markerData) {
      this.addMarker();
    }
  }

  private initMap(): void {
    // Set a fallback center if markerData is undefined
    const initialCoordinates: [number, number] = this.markerData?.coordinates || [0, 0];

    this.map = L.map('map', {
      center: initialCoordinates, // Set initial map center
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  addMarker(): void {
    if (this.markerData && this.markerData.coordinates.length === 2) {
      const { name, coordinates } = this.markerData;

      // Clear existing markers (optional)
      this.map!.eachLayer(layer => {
        if ((layer as L.Marker).getLatLng) {
          this.map!.removeLayer(layer);
        }
      });

      // Add the new marker
      L.marker(coordinates)
        .addTo(this.map!)
        .bindPopup(name)
        .openPopup();

      // Pan the map to the new marker
      this.map!.setView(coordinates, this.map!.getZoom());
    } else {
      console.error('Invalid or missing marker data');
    }
  }
}
