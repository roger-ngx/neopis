import React, { Component } from 'react';
import './LineChart.css';
import * as d3 from 'd3';

export class LineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      line: null
    }
  }

  componentDidMount() {
    var margin = {
      top: 4,
      right: 0,
      bottom: 8,
      left: 4
    },
    width = window.innerWidth - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

    var parseDate = d3.timeParse("%Y%m%d");

    var x = d3.scaleTime()
      .range([0, width]);

    var y = d3.scaleLinear()
      .range([height, 0]);

    var line = d3.line()
      .curve(d3.curveCatmullRomOpen)
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.trend);
      });

    d3.tsv("./data.csv").then((data) => {
      data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.trend = +d.trend;
      });

      x.domain([data[0].date, data[data.length - 1].date]);
      y.domain(d3.extent(data, function (d) {
        return d.trend;
      }));

      this.setState({
        line: line(data)
      });
    });
  }

  render() {
    return <svg width="100%" height="240">
      <g transform="translate(4,4)">
        <linearGradient id="energy"
          gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffae33"></stop>
          <stop offset="66%" stopColor="#ff5742"></stop>
          <stop offset="100%" stopColor="#ff009e"></stop>
        </linearGradient>

        <linearGradient id="battery"
          gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="0">
          <stop offset="0%" stopColor="#338fff"></stop>
          <stop offset="66%" stopColor="#40ca88"></stop>
        </linearGradient>

        <linearGradient id="electricity"
          gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="0">
          <stop offset="0%" stopColor="#0051b2"></stop>
          <stop offset="100%" stopColor="#8828da"></stop>
        </linearGradient>
        <path className="line" d={this.state.line}></path>
      </g>
    </svg>
  }
}

//https://bl.ocks.org/kdubbels/c445744cd3ffa18a5bb17ac8ad70017e