import { Component, OnInit } from '@angular/core';
import {GraphDataStreamService, HookLoadData, pointData} from "../graph-data-stream.service";
import Chart from 'chart.js'
import {IGraph} from "../app.component";

@Component({
  selector: 'app-line-graph-component2',
  templateUrl: './line-graph-component2.component.html',
  styleUrls: ['./line-graph-component2.component.css']
})
export class LineGraphComponent2Component implements OnInit, IGraph {
  private xAxis: string[] = [];
  private yAxis: number[] = [];

  private ctx;
  private chart;
  private referenceToHookLoadData: HookLoadData;
  private liveModeInterval: number = 0;

  private timeIntervalRef: number;
  private graphNodeRange = 100;
  private hookLoadDataSize: number = 0;

  numberOfNodesPerJump: number = 5;

  private chartOptions = {
    elements: {
      line: {
        tension: 0 // disables bezier curves to improve speed
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 0 // general animation time
    },
    hover: {
      animationDuration: 0 // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0 // animation duration after a resize
  };

  private chartData = {
    labels: this.xAxis,
    datasets: [{
      data: this.yAxis,
      label: "HDRK data",
      borderColor: "#3e95cd",
      fill: false
    }]
  };

  constructor(private graphService: GraphDataStreamService) { }

  ngOnInit() {
    //We need to be careful to not edit this data, TODO: need to think of a solution to this....
    this.referenceToHookLoadData = this.graphService.getHookLoadDataReference();

    this.liveModeInterval = this.graphService.defaultGraphInterval;
    this.createChart();
    this.beginLiveMode();
  }

  private createChart() {
    this.ctx = document.getElementById('Chart');//.getContext('2d');
    this.chart = new Chart(this.ctx.getContext('2d'), {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions
    });
  }

  private beginLiveMode() {
    this.intervalGraphUpdate();
  }

  private intervalGraphUpdate(){
    //Get handle on set timeout and store. Delete it when interval changes and recreate
    this.updateDataAndDraw();
    this.timeIntervalRef = setTimeout(() => {this.intervalGraphUpdate()}, this.liveModeInterval);
  }

  private updateDataAndDraw() {
    this.drawNewestSinglePoint();
    this.chart.update();
  }

  private drawNewestSinglePoint(){
    //If there has been an update to the data.
    if (this.referenceToHookLoadData.length > this.hookLoadDataSize) {
      let dataPoint: pointData = this.referenceToHookLoadData[this.hookLoadDataSize];
      if (dataPoint != undefined) {
        this.hookLoadDataSize++;
        if (this.xAxis.length > this.graphNodeRange) {
          this.xAxis.shift();
          this.yAxis.shift();
        }
        this.xAxis.push(new Date(dataPoint.x).toLocaleTimeString());
        this.yAxis.push(dataPoint.y);
      }
    }
  }

  //This will take a memory hit
  private changeGraphToHistorical(){
    //Clear our data
    this.xAxis = [];
    this.yAxis = [];

    //Maybe need some sort of averaging to make the graph look less busy.
    this.referenceToHookLoadData.forEach((dataPoint: pointData) => {
      this.xAxis.push(new Date(dataPoint.x).toLocaleTimeString());
      this.yAxis.push(dataPoint.y);
    });

    this.deepUpdateGraph();
  }

  private changeGraphToLive() {
    //Clear our data
    this.xAxis = [];
    this.yAxis = [];
    this.hookLoadDataSize = this.referenceToHookLoadData.length;
    //Get latest X nodes to fill the graph
    for (let i = 0; i < this.graphNodeRange ; i++) {
      let dataPoint: pointData = this.referenceToHookLoadData[this.hookLoadDataSize - this.graphNodeRange + i];
      if (dataPoint != undefined) {
        this.xAxis.push(new Date(dataPoint.x).toLocaleTimeString());
        this.yAxis.push(dataPoint.y);
      }
    }
    this.deepUpdateGraph();
    this.beginLiveMode();
  }

  private stopLiveMode(){
    clearTimeout(this.timeIntervalRef);
    this.timeIntervalRef = 0;
  }

  private deepUpdateGraph() {
    this.chartData = {
      labels: this.xAxis,
      datasets: [{
        data: this.yAxis,
        label: "HDRK data",
        borderColor: "#3e95cd",
        fill: false
      }]
    };
    this.chart.data = this.chartData;
    this.chart.update();
  }

  historyMode() {
    console.log("You selected history mode");
    //Stop doing live mode
    this.stopLiveMode();
    this.changeGraphToHistorical();
  }

  liveMode() {
    console.log("You selected live mode");
    this.changeGraphToLive();
  }

  pause() {
    console.log("You pressed pause button");
    this.stopLiveMode();
  }

  play() {
    console.log("You pressed play button");
    this.beginLiveMode();
  }

  changeIntervalRate(newIntervalRate: number) {
    console.log("Changed interval to: " + newIntervalRate);
    this.liveModeInterval = newIntervalRate;

    //Check if the interval is turned off. We only want to update it when it is on
    if (this.timeIntervalRef !== 0) {
      clearTimeout(this.timeIntervalRef);
      this.beginLiveMode();
    }
  }

  dataPointBack() {
    for(let i = 0 ; i < this.numberOfNodesPerJump; i++) {
      //If there is a need to draw a back point
      if (this.xAxis.length >= this.graphNodeRange) {
        //If we can get a back point
        let dataPoint: pointData = this.referenceToHookLoadData[this.hookLoadDataSize - this.graphNodeRange];
        if (dataPoint != undefined) {
          this.xAxis.pop();
          this.yAxis.pop();
          this.xAxis.unshift(new Date(dataPoint.x).toLocaleTimeString());
          this.yAxis.unshift(dataPoint.y);
          this.hookLoadDataSize--;
        }
      }
    }
    this.chart.update();
  }

  dataPointForward() {
    for(let i = 0 ; i < this.numberOfNodesPerJump; i++) {
      //If there is a need to draw a forward point
      this.drawNewestSinglePoint();
    }
    this.chart.update();
  }
}
