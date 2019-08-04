import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'HKLD-LineGraph';
}

export interface IGraph {
  pause();
  play();
  historyMode();
  liveMode();
  changeIntervalRate(newIntervalRate: number);
  dataPointBack();
  dataPointForward();
}

const defaultGraphInterval: number = 200;
