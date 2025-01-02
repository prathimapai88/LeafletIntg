import { Component, OnInit } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-map-plot',
  templateUrl: './map-plot.component.html',
  styleUrls: ['./map-plot.component.scss'],
})
export class MapPlotComponent implements OnInit {
  private map: L.Map | undefined;
  private markers: L.Marker[] = [];  // To keep track of the markers on the map

  // Define a list of 40 locations with different types
  locations = [
    { lat: 51.5074, lng: -0.1278, type: 'port', name: 'Port of London', location: 'London, UK' },
    { lat: 40.7128, lng: -74.0060, type: 'terminal', name: 'Port of New York', location: 'New York, USA' },
    { lat: 22.3039, lng: 114.1835, type: 'berth', name: 'Hong Kong Container Terminal', location: 'Hong Kong' },
    { lat: 25.7617, lng: -80.1918, type: 'port', name: 'Port of Miami', location: 'Miami, USA' },
    { lat: 41.8919, lng: 12.5113, type: 'refinery', name: 'Ravenna Refinery', location: 'Ravenna, Italy' },
    // Add more locations here...
  ];

  // Define marker icons for different types
  private icons: { [key: string]: L.Icon } = {
    port: L.icon({ iconUrl: '../../../assets/images/port.svg', iconSize: [10, 10] }),
    terminal: L.icon({ iconUrl: '../../../assets/images/terminal.svg', iconSize: [10, 10] }),
    berth: L.icon({ iconUrl: '../../../assets/images/Berth.svg', iconSize: [10, 10] }),
    refinery: L.icon({ iconUrl: '../../../assets/images/refinery.svg', iconSize: [10, 10] }),
  };

  // List of available location types for the dropdown filter
  locationTypes = ['port', 'terminal', 'berth', 'refinery'];

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [40.7128, -74.0060],
      zoom: 2,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.addMarkers();  // Add all markers initially
  }

  private addMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => {
      this.map?.removeLayer(marker);
    });

    // Add markers based on selected filter
    this.locations.forEach(location => {
      const icon = this.icons[location.type] || this.icons['default'];
      const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(this.map!)
        .bindPopup(`<b>${location.name}</b><br>${location.type}`);
      this.markers.push(marker);  // Store the marker for later removal
    });
  }

  // Method to filter locations based on selected types
  filterLocations(event: any): void {
    const selectedTypes = Array.from(event.target.selectedOptions)
      .map((option:any) => option.value);

    // Filter locations based on selected types
    const filteredLocations = this.locations.filter(location =>
      selectedTypes.includes(location.type)
    );

    // Clear existing markers and add filtered ones
    this.markers.forEach(marker => {
      this.map?.removeLayer(marker);
    });
    this.markers = [];

    filteredLocations.forEach(location => {
      const icon = this.icons[location.type] || this.icons['default'];
      const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(this.map!)
        .bindPopup(`<b>${location.name}</b><br>${location.type}`);
      this.markers.push(marker);
    });
  }
}
