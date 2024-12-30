import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'LeafletIntg';
  marker = {
    name: 'Big Ben',
    coordinates: [51.5007, -0.1246] as [number, number]
  };
}
