
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';
import { MapSelectorComponent } from './components/maps/map-selector/map-selector.component';
import { MapDisplayComponent } from './components/common/map-display/map-display.component';
import { HomeComponent } from './components/common/home/home.component';
import { MapPlotComponent } from './components/maps/map-plot/map-plot.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
{ path: '',component: HomeComponent},
{ path: 'map',component: MapDisplayComponent},
{ path: 'plot',component: MapPlotComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    MapSelectorComponent,
    MapDisplayComponent,
    MapPlotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
