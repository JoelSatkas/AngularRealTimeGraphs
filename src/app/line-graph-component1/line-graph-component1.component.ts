import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GraphDataStreamService} from '../graph-data-stream.service'
import * as d3 from 'd3'
import * as _ from 'underscore'

@Component({
  selector: 'app-line-graph-component1',
  templateUrl: './line-graph-component1.component.html',
  styleUrls: ['./line-graph-component1.component.css']
})
export class LineGraphComponent1Component implements OnInit {
  data: {
    x: Date,
    y: number
  }[] = [];
  chart;

  @ViewChild('chart')
  chartElement: ElementRef;
  private chartProps: any;
  throttledUpdateGraph;

  constructor(private graphService: GraphDataStreamService) { }

  //Get this to subscribe to web socket service and handle when data is pushed
  ngOnInit() {
    this.throttledUpdateGraph = _.throttle(this.updateGraph, 2000);
    this.createChart();
    this.initIoConnection();
  }

  private createChart() {
    this.chartProps = {};

    // Set the dimensions of the canvas / graph
    let margin = { top: 30, right: 20, bottom: 30, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleTime().range([0, width]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    let xAxis = d3.axisBottom(this.chartProps.x);
    let yAxis = d3.axisLeft(this.chartProps.y).ticks(5);

    let _this = this;

    // Define the line
    let valueLine = d3.line<{Date, number}>()
      .x(function (d) {
        if (d.x instanceof Date) {
          return _this.chartProps.x(d.x.getTime());
        }
      })
      .y(function (d) { return _this.chartProps.y(d.y); });

    let svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale the range of the data
    this.chartProps.x.domain(
      d3.extent(_this.data, function (d) {
        if (d.x instanceof Date)
          return (d.x as Date).getTime();
      }));
    this.chartProps.y.domain([0, d3.max(this.data, function (d) {
      return d.y;
    })]);

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line line1')
      .style('stroke', 'black')
      .style('fill', 'none')
      .attr('d', valueLine(_this.data));

    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    this.chartProps.valueline = valueLine;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
  }

  private initIoConnection(): void {
    this.graphService.subscribeToGraph(this.onLineGraphDataReceive.bind(this));
  }

  private onLineGraphDataReceive(data){
    //Push to the line graph and render the graph
    // console.log("message received");
    this.updateData(data);
  }

  private updateData(data) {
    this.data.push({
      x: new Date(data[0]),
      y: data[1]
    });
    this.updateGraph();
  }

  updateGraph() {
    // Scale the range of the data again
    this.chartProps.x.domain(d3.extent(this.data, function (d) {
      if (d.x instanceof Date) {
        return d.x.getTime();
      }
    }));

    this.chartProps.y.domain([0, d3.max(this.data, function (d) { return d.y; })]);

    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();

    // Make the changes to the line chart
    this.chartProps.svg.select('.line.line1') // update the line
      .attr('d', this.chartProps.valueline(this.data));

    this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);

    this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);
  }
}
