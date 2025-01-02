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
  selectedLocationTypes: string[] = [];
  private popups: L.Popup[] = []; // Store references to popups
  showAllPopups: boolean = false; // Toggle state
  selectedLocation: string = ''; // Two-way binding for the typeahead input

   locations = [
    { lat: 51.5074, lng: -0.1278, type: 'port', name: 'Port of London', location: 'London, UK' },
    { lat: 40.7128, lng: -74.0060, type: 'terminal', name: 'Port of New York', location: 'New York, USA' },
    { lat: 22.3039, lng: 114.1835, type: 'berth', name: 'Hong Kong Container Terminal', location: 'Hong Kong' },
    { lat: 25.7617, lng: -80.1918, type: 'port', name: 'Port of Miami', location: 'Miami, USA' },
    { lat: 41.8919, lng: 12.5113, type: 'refinery', name: 'Ravenna Refinery', location: 'Ravenna, Italy' },

    // Additional Locations
    { lat: 34.0522, lng: -118.2437, type: 'port', name: 'Port of Los Angeles', location: 'Los Angeles, USA' },
    { lat: 35.6895, lng: 139.6917, type: 'terminal', name: 'Tokyo Port Terminal', location: 'Tokyo, Japan' },
    { lat: -33.8688, lng: 151.2093, type: 'berth', name: 'Sydney Harbor Terminal', location: 'Sydney, Australia' },
    { lat: 48.8566, lng: 2.3522, type: 'refinery', name: 'Le Havre Refinery', location: 'Le Havre, France' },
    { lat: 55.7558, lng: 37.6173, type: 'port', name: 'Port of St. Petersburg', location: 'St. Petersburg, Russia' },
    { lat: 19.0760, lng: 72.8777, type: 'terminal', name: 'Nhava Sheva Terminal', location: 'Mumbai, India' },
    { lat: 35.6892, lng: 51.3890, type: 'port', name: 'Bandar Abbas Port', location: 'Tehran, Iran' },
    { lat: 37.7749, lng: -122.4194, type: 'berth', name: 'San Francisco Terminal', location: 'San Francisco, USA' },
    { lat: -23.5505, lng: -46.6333, type: 'refinery', name: 'Santos Refinery', location: 'Santos, Brazil' },
    { lat: 31.2304, lng: 121.4737, type: 'port', name: 'Port of Shanghai', location: 'Shanghai, China' },
    { lat: -26.2041, lng: 28.0473, type: 'terminal', name: 'Port of Durban', location: 'Durban, South Africa' },
    { lat: 52.3676, lng: 4.9041, type: 'berth', name: 'Amsterdam Berth', location: 'Amsterdam, Netherlands' },
    { lat: 59.3293, lng: 18.0686, type: 'refinery', name: 'Stockholm Refinery', location: 'Stockholm, Sweden' },
    { lat: 33.8688, lng: 151.2093, type: 'port', name: 'Port Botany', location: 'Sydney, Australia' },
    { lat: 1.3521, lng: 103.8198, type: 'terminal', name: 'Port of Singapore', location: 'Singapore' },

    // Continue adding similar objects until reaching 100 entries
    { lat: 32.7767, lng: -96.7970, type: 'port', name: 'Port of Dallas', location: 'Dallas, USA' },
    { lat: 50.8503, lng: 4.3517, type: 'terminal', name: 'Antwerp Terminal', location: 'Antwerp, Belgium' },
    { lat: 45.4642, lng: 9.1900, type: 'berth', name: 'Milan Berth', location: 'Milan, Italy' },
    { lat: 13.7563, lng: 100.5018, type: 'refinery', name: 'Bangkok Refinery', location: 'Bangkok, Thailand' },
    { lat: 30.0444, lng: 31.2357, type: 'port', name: 'Port Said', location: 'Cairo, Egypt' },

    { lat: 53.3498, lng: -6.2603, type: 'terminal', name: 'Dublin Terminal', location: 'Dublin, Ireland' },
    { lat: -34.6037, lng: -58.3816, type: 'berth', name: 'Buenos Aires Berth', location: 'Buenos Aires, Argentina' },
    { lat: 55.9533, lng: -3.1883, type: 'refinery', name: 'Grangemouth Refinery', location: 'Edinburgh, Scotland' },
    { lat: 38.7223, lng: -9.1393, type: 'port', name: 'Port of Lisbon', location: 'Lisbon, Portugal' },
    { lat: 47.6062, lng: -122.3321, type: 'terminal', name: 'Seattle Port Terminal', location: 'Seattle, USA' },

    { lat: 40.4168, lng: -3.7038, type: 'berth', name: 'Madrid Berth', location: 'Madrid, Spain' },
    { lat: -12.0464, lng: -77.0428, type: 'refinery', name: 'Lima Refinery', location: 'Lima, Peru' },
    { lat: 51.1657, lng: 10.4515, type: 'port', name: 'Hamburg Port', location: 'Hamburg, Germany' },
    { lat: -37.8136, lng: 144.9631, type: 'terminal', name: 'Melbourne Terminal', location: 'Melbourne, Australia' },

    { lat: 39.9042, lng: 116.4074, type: 'berth', name: 'Beijing Berth', location: 'Beijing, China' },
    { lat: 41.9028, lng: 12.4964, type: 'refinery', name: 'Rome Refinery', location: 'Rome, Italy' },
    { lat: -22.9068, lng: -43.1729, type: 'port', name: 'Rio de Janeiro Port', location: 'Rio de Janeiro, Brazil' },
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
    this.selectedLocationTypes = [...this.locationTypes];
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
    this.locations.forEach(location => {
      const icon = this.icons[location.type] || this.icons['default'];
      const marker = L.marker([location.lat, location.lng], { icon });
      const popup = L.popup()
        .setLatLng([location.lat, location.lng])
        .setContent(`<b>${location.name}</b><br>${location.type}`);

      marker.addTo(this.map!);
      this.markers.push(marker);
      this.popups.push(popup);
    });
  }



  // Method to filter locations based on selected types
  filterLocations(event: any): void {
    const selectedTypes = Array.from(event.target.selectedOptions)
      .map((option:any) => option.value);

    // Filter locations based on selected types
    const filteredLocations = this.locations.filter(location =>
      this.selectedLocationTypes.includes(location.type)
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

  togglePopups(): void {
    if (this.showAllPopups) {
      // Close all popups
      this.popups.forEach(popup => {
        this.map!.removeLayer(popup);
      });
    } else {
      // Open all popups
      this.popups.forEach(popup => {
        this.map!.addLayer(popup);
      });
    }
    this.showAllPopups = !this.showAllPopups;
  }

  
}
