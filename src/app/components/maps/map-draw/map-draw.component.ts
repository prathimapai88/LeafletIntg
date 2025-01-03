import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';

@Component({
  selector: 'app-map-draw',
  templateUrl: './map-draw.component.html',
  styleUrls: ['./map-draw.component.scss']
})
export class MapDrawComponent implements AfterViewInit {

  private map!: L.Map;
  private drawnItems: L.FeatureGroup = new L.FeatureGroup();
  private markers: L.Marker[] = []; // Array to store all added markers
  @Output() markerAdded = new EventEmitter<any>();
  @Output() markersInPolygon = new EventEmitter<any>(); // Emit markers inside polygon



   // Define the custom icon
   private customIcon = L.icon({
    iconUrl: '../../../assets/images/marker.png', // Path to the custom PNG file
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point of the icon
    popupAnchor: [0, -32], // Point where the popup opens relative to the icon
  });



  ngAfterViewInit(): void {
    this.initMap();
    this.addDrawControl();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.map.addLayer(this.drawnItems);
  }

  private addDrawControl(): void {
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems, // Layer to edit
      },
      draw: {
        polyline: false,
        circle: false,
        rectangle: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false, // Restrict self-intersecting polygons
          showArea: true,           // Display the area of the polygon
        }
      },
    });

    this.map.addControl(drawControl);

    // Handle created event for shapes and markers
    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;

      // Add the new layer to the map and FeatureGroup
      this.drawnItems.addLayer(layer);

      if (layer instanceof L.Marker) {
        const markerName = window.prompt('Enter a name for this marker:', 'New Marker') || 'Unnamed Marker';
         // Apply custom icon to the marker
        layer.setIcon(this.customIcon); 
        const markerDetails = {
          name: markerName,
          lat: layer.getLatLng().lat,
          lng: layer.getLatLng().lng,
        };

        console.log('Marker details:', markerDetails);

        // Add a popup to the marker with its name
        layer.bindPopup(`<b>${markerName}</b><br>Lat: ${markerDetails.lat}, Lng: ${markerDetails.lng}`).openPopup();

        // Add marker to markers array
        this.markers.push(layer);

        // Emit marker details
        this.markerAdded.emit(markerDetails);
      } else if (layer instanceof L.Polygon) {
        const coordinates = layer.getLatLngs();
        console.log('Polygon coordinates:', coordinates);

        // Collate markers inside the polygon
        this.findMarkersInPolygon(layer);
      }
    });

    // Handle edited event
    this.map.on(L.Draw.Event.EDITED, (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        if (layer instanceof L.Polygon) {
          const coordinates = layer.getLatLngs();
          console.log('Edited polygon coordinates:', coordinates);

          // Re-collate markers inside the edited polygon
          this.findMarkersInPolygon(layer);
        }
      });
    });

    // Handle deleted event
    this.map.on(L.Draw.Event.DELETED, () => {
      console.log('Shape deleted');
    });
  }

  private findMarkersInPolygon(polygon: L.Polygon): void {
    const polygonBounds = polygon.getBounds();
    const markersInPolygon: any[] = [];
  
    this.markers.forEach((marker) => {
      if (polygonBounds.contains(marker.getLatLng())) {
        const popupContent = marker.getPopup()?.getContent();
        let markerName = 'Unnamed Marker'; // Default name in case of invalid content
  
        if (typeof popupContent === 'string') {
          // Extract name if popup content is a string
          markerName = popupContent.split('<br>')[0].replace('<b>', '').replace('</b>', '');
        }
  
        markersInPolygon.push({
          name: markerName,
          lat: marker.getLatLng().lat,
          lng: marker.getLatLng().lng,
        });
      }
    });
  
    console.log('Markers inside polygon:', markersInPolygon);
    this.markersInPolygon.emit(markersInPolygon); // Emit the list of markers inside the polygon
  }
  
}
