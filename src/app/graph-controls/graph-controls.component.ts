import {Component, Input, OnInit} from '@angular/core';
import {IGraph} from "../app.component";
import {MatSliderChange} from "@angular/material";

@Component({
  selector: 'app-graph-controls',
  templateUrl: './graph-controls.component.html',
  styleUrls: ['./graph-controls.component.css']
})
export class GraphControlsComponent implements OnInit {
  //Interval vars
  private intervalRateMinimum: number = 30;
  private intervalRateMaximum: number = 300;
  private intervalRateDefault: number = 60;//TODO: hook the default up to the global

  //Icon names
  private playIcon: string = "play_arrow";
  private pauseIcon: string = "pause";
  private liveModeIcon: string = "timeline";
  private historicalModeIcon: string = "history";

  private currentModeIcon: string = this.historicalModeIcon;
  private currentPlayIcon: string = this.pauseIcon;

  private paused: boolean = false;
  private liveMode: boolean = true;
  private disablePausedFunctionality: boolean = true;
  private disablePlayButton: boolean = false;

  @Input() graph: IGraph;

  constructor() { }

  ngOnInit() {
  }

  pauseButtonClicked() {
    this.paused = !this.paused;
    if (this.graph != undefined) {
      if (this.paused) {
        this.graph.pause();
        this.currentPlayIcon = this.playIcon;
        this.disablePausedFunctionality = false;
      }
      else {
        this.graph.play();
        this.currentPlayIcon = this.pauseIcon;
        this.disablePausedFunctionality = true;
      }
    }
  }

  liveButtonClicked() {
    this.liveMode = !this.liveMode;
    if (this.graph != undefined) {
      if (this.liveMode){
        this.graph.liveMode();

        //It is now playing
        this.paused = false;

        //Switch buttons functionality appearance
        this.currentModeIcon = this.historicalModeIcon;
        this.currentPlayIcon = this.pauseIcon;

        //Disable arrows since this is now live
        this.disablePausedFunctionality = true;
        this.disablePlayButton = false;
      }
      else {
        this.graph.historyMode();

        //History mode is static so it is paused.
        this.paused = true;

        //Switch buttons functionality appearance
        this.currentModeIcon = this.liveModeIcon;

        //Arrows dont work for history mode
        this.disablePausedFunctionality = true;
        this.disablePlayButton = true;
      }
    }
  }

  dataPointBack() {
    this.graph.dataPointBack();
  }

  dataPointForward() {
    this.graph.dataPointForward();
  }

  //TODO find more efficient way. Maybe only send data when mouse click is released
  //TODO see a bug when sliding the slider a lot, need to wait for timeout first then draw graph
  onSliderInputChange(event: MatSliderChange) {
    this.graph.changeIntervalRate(event.value);
  }
}
