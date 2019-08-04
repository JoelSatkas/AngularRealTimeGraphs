import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule, MatSliderModule, MatIconModule, MatTooltipModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LineGraphComponent1Component } from './line-graph-component1/line-graph-component1.component';
import {FormsModule} from "@angular/forms";
import { LineGraphComponent2Component } from './line-graph-component2/line-graph-component2.component';
import { LineGraphComponent3Component } from './line-graph-component3/line-graph-component3.component';
import { GraphControlsComponent } from './graph-controls/graph-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    LineGraphComponent1Component,
    LineGraphComponent2Component,
    LineGraphComponent3Component,
    GraphControlsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
