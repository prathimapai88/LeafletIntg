import { Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements OnInit, OnChanges {
  private map: L.Map | undefined;
  private currentMarker: L.Marker | null = null; // Track the current marker

  @Input() markerData?: { name: string; coordinates: [number, number] };
  @Output() locationSelected: EventEmitter<[number, number]> = new EventEmitter(); // Event emitter for the selected location

  ngOnInit(): void {
    this.initMap();
    if (this.markerData) {
      this.addMarker(this.markerData.name, this.markerData.coordinates);
    }

    // Allow user to select a new location by clicking on the map
    this.map?.on('click', (e: L.LeafletMouseEvent) => {
      const selectedCoordinates: [number, number] = [e.latlng.lat, e.latlng.lng];
      const locationName = this.markerData?.name || '';

      // Remove the existing marker and add a new one
      this.addMarker(locationName, selectedCoordinates);

      // Emit the selected latitude and longitude
      this.locationSelected.emit(selectedCoordinates);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markerData'] && !changes['markerData'].isFirstChange() && this.markerData) {
      this.addMarker(this.markerData.name, this.markerData.coordinates);
    }
  }

  private initMap(): void {
    const initialCoordinates: [number, number] = this.markerData?.coordinates || [0, 0];

    this.map = L.map('map', {
      center: initialCoordinates,
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  addMarker(name: string, coordinates: [number, number]): void {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }

    // Remove the existing marker if present
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    // Define custom icon
    const customIcon = L.icon({
      iconUrl: '../../../assets/images/marker.png', // Path to the custom marker image in assets
      iconSize: [25, 41], // Size of the marker
      iconAnchor: [12, 41], // Position of the icon's anchor point
      popupAnchor: [1, -34], // Position of the popup relative to the icon
      shadowUrl: '', // Optional: If you have a custom shadow image
      shadowSize: [41, 41] // Size of the shadow (default is 41x41)
    });

    // Create a new marker with the custom icon and add it to the map
    this.currentMarker = L.marker(coordinates, { icon: customIcon })
      .addTo(this.map)
      .bindPopup(name)
      .openPopup();

    // Pan the map to the new marker
    this.map.setView(coordinates, this.map.getZoom());
  }
}
