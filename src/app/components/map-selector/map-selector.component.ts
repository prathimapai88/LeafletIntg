import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements OnInit, OnChanges {
  private map: L.Map | undefined;

  // Declare markerData as an input property
  @Input() markerData: { name: string; coordinates: [number, number] } = {
    name: 'Default Marker',
    coordinates: [51.5072, 0.1276] // Default coordinates (London)
  };

  ngOnInit(): void {
    this.initMap();
    this.addMarker();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markerData'] && !changes['markerData'].isFirstChange()) {
      this.addMarker();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.markerData.coordinates, // Set initial map center
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  addMarker(): void {
    if (this.markerData.coordinates.length === 2) {
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
      console.error('Invalid marker data provided');
    }
  }
}
