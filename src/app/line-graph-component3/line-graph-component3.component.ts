import { Component, OnInit } from '@angular/core';
import {GraphDataStreamService, HookLoadData, pointData} from "../graph-data-stream.service";
import CanvasJS from '../../lib/CanvasJS/canvasjs.min.js'
import {IGraph} from "../app.component";

@Component({
  selector: 'app-line-graph-component3',
  templateUrl: './line-graph-component3.component.html',
  styleUrls: ['./line-graph-component3.component.css']
})
export class LineGraphComponent3Component implements OnInit, IGraph {
  private data = [];
  private chart;

  private referenceToHookLoadData: HookLoadData;
  private liveModeInterval: number = 0;

  private timeIntervalRef: number;
  private graphNodeRange = 100;
  private hookLoadDataSize: number = 0;

  numberOfNodesPerJump: number = 5;

  constructor(private graphService: GraphDataStreamService) { }

  ngOnInit() {
    //We need to be careful to not edit this data, TODO: need to think of a solution to this....
    this.referenceToHookLoadData = this.graphService.getHookLoadDataReference();

    this.liveModeInterval = this.graphService.defaultGraphInterval;
    this.createChart();
    this.beginLiveMode();
  }

  private createChart(){
    this.chart = new CanvasJS.Chart("canvasJsChart", {
      title :{
        text: "HKLD Data"
      },
      axisY: {
        includeZero: false
      },
      data: [{
        type: "line",
        dataPoints: this.data
      }]
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
    this.chart.render();
  }

  private drawNewestSinglePoint(){
    //If there has been an update to the data.
    if (this.referenceToHookLoadData.length > this.hookLoadDataSize) {
      let dataPoint: pointData = this.referenceToHookLoadData[this.hookLoadDataSize];
      if (dataPoint != undefined) {
        if (this.data.length >= this.graphNodeRange) {
          this.data.shift();
        }
        this.data.push(dataPoint);
        this.hookLoadDataSize++;
      }
    }
  }

  //This will take a memory hit
  private changeGraphToHistorical(){
    //Maybe need some sort of averaging to make the graph look less busy.

    //For some reason with canvas js we need to pop the array and add one at a time
    //Need to investigate this for faster responses and less memory consumption. Could be a javascript referencing issue
    this.deepCleanChart();
    this.referenceToHookLoadData.forEach((dataPoint: pointData) => {
      this.data.push(dataPoint);
    });
    this.chart.render();
  }

  private changeGraphToLive() {
    //Clear our data
    this.deepCleanChart();
    //Get latest X nodes to fill the graph
    for (let i = 0; i < this.graphNodeRange ; i++) {
      let dataPoint: pointData = this.referenceToHookLoadData[this.hookLoadDataSize - this.graphNodeRange + i];
      if (dataPoint != undefined) {
        this.data.push(dataPoint);
      }
    }
    this.chart.render();
    this.beginLiveMode();
  }

  private deepCleanChart() {
    while (this.data.length > 0) {
      this.data.pop();
    }
  }

  private stopLiveMode(){
    clearTimeout(this.timeIntervalRef);
    this.timeIntervalRef = 0;
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
      if (this.data.length >= this.graphNodeRange) {
        //If we can get a back point
        let dataPoint: pointData = this.referenceToHookLoadData[this.hookLoadDataSize - this.graphNodeRange];
        if (dataPoint != undefined) {
          this.data.pop();
          this.data.unshift(dataPoint);
          this.hookLoadDataSize--;
        }
      }
    }
    this.chart.render();
  }

  dataPointForward() {
    for(let i = 0 ; i < this.numberOfNodesPerJump; i++) {
      this.drawNewestSinglePoint();
    }
    this.chart.render();
  }
}
