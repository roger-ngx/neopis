import React, { Component } from 'react';
import './LineChartCrs.scss';
import * as d3 from 'd3';

class LineChartCrs extends Component {

  constructor(props) {
    super(props);
    this.chartArea = React.createRef();
    this.gradients = ['url(#electricity)', 'url(#energy)', 'url(#battery)'];
    this.margin = {
      top: 20,
      right: 30,
      bottom: 20,
      left: 30
    };
  }

  componentDidMount() {
    let width = this.chartArea.current.clientWidth - this.margin.left - this.margin.right;
    let height = this.chartArea.current.clientHeight - this.margin.top - this.margin.bottom;

    let parseDate = d3.timeParse("%Y%m%d");

    this.xScale = d3.scaleTime()
      .range([0, width]);

    this.yScale = d3.scaleLinear()
      .range([height, 0]);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(Math.max(width / 75, 4))
      .tickSize(-height);

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(Math.max(height / 75, 4))
      .tickSize(-width)
      .tickFormat("");

    this.line = d3.line()
      .curve(d3.curveCatmullRomOpen)
      .x(d => {
        return this.xScale(d.date);
      })
      .y(d => {
        return this.yScale(d.temperature);
      });

    this.svg = d3.select(this.chartArea.current).append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    d3.tsv('./temp.tsv').then(data => {

      color.domain(d3.keys(data[0]).filter(function (key) {
        return key !== "date";
      }));

      data.forEach(function (d) {
        d.date = parseDate(d.date);
      });

      let cities = color.domain().map(function (name) {
        return {
          name: name,
          values: data.map(function (d) {
            return {
              date: d.date,
              temperature: +d[name]
            };
          })
        };
      });

      this.xScale.domain(d3.extent(data, function (d) {
        return d.date;
      }));

      this.yScale.domain([
        d3.min(cities, function (c) {
          return d3.min(c.values, function (v) {
            return v.temperature;
          });
        }),
        d3.max(cities, function (c) {
          return d3.max(c.values, function (v) {
            return v.temperature;
          });
        })
      ]);

      // let legend = this.svg.selectAll('g')
      //   .data(cities)
      //   .enter()
      //   .append('g')
      //   .attr('class', 'legend');

      // legend.append('rect')
      //   .attr('x', width - 20)
      //   .attr('y', function (d, i) {
      //     return i * 20;
      //   })
      //   .attr('width', 10)
      //   .attr('height', 10)
      //   .style('fill', function (d) {
      //     return color(d.name);
      //   });

      // legend.append('text')
      //   .attr('x', width - 8)
      //   .attr('y', function (d, i) {
      //     return (i * 20) + 9;
      //   })
      //   .text(function (d) {
      //     return d.name;
      //   })
      //   .attr('fill', 'white');

      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(this.xAxis);

      this.svg.append("g")
      .attr("class", "x axis")
      .call(this.yAxis);

      let city = this.svg.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");

      city.append("path")
        .attr("class", "line")
        .attr("d", d => {
          return this.line(d.values);
        })
        .style("stroke", (d, index) => {
          // return color(d.name);
          return this.gradients[index]
        });

      var mouseG = this.svg.append("g")
        .attr("class", "mouse-over-effects");

      mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "white")
        .style("stroke-width", "1px")
        .style("opacity", "0");

      var lines = document.getElementsByClassName('line');

      var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(cities)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

      mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", function (d) {
          return color(d.name);
        })
        .style("fill", "none")
        .style("stroke-width", "2px")
        .style("opacity", "0");

      mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

      const ctx = this;

      mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () { // on mouse out hide line, circles and text
          d3.select(".mouse-line")
            .style("opacity", "0");
          d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
          d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
        })
        .on('mouseover', function () { // on mouse in show line, circles and text
          d3.select(".mouse-line")
            .style("opacity", "1");
          d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
          d3.selectAll(".mouse-per-line text")
            .style("opacity", "1");
        })
        .on('mousemove', function () { // mouse moving over canvas
          var mouse = d3.mouse(this);
          var pos;

          d3.select(".mouse-line")
            .attr("d", function () {
              var d = "M" + mouse[0] + "," + height;
              d += " " + mouse[0] + "," + 0;
              return d;
            });

          d3.selectAll(".mouse-per-line")
            .attr("transform", function (d, i) {
              // var xDate = ctx.xScale.invert(mouse[0]),
              //   bisect = d3.bisector(function (d) { return d.date; }).right;
              // var index = bisect(d.values, xDate);

              var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

              while (true) {
                target = Math.floor((beginning + end) / 2);
                pos = lines[i].getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
                }
                if (pos.x > mouse[0]) end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; //position found
              }

              d3.select(this).select('text')
                .text(ctx.yScale.invert(pos.y).toFixed(2))
                .attr("fill", 'white');

              return "translate(" + mouse[0] + "," + pos.y + ")";
            });
        });
    });

    d3.select(window).on('resize', this.resize.bind(this));
  }

  resize() {
    var width = this.chartArea.current.clientWidth - this.margin.left - this.margin.right,
      height = this.chartArea.current.clientHeight - this.margin.top - this.margin.bottom;

    // Update the range of the scale with new width/height
    this.xScale.range([0, width]);
    this.yScale.range([height, 0]);

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(Math.max(width / 75, 4))
      .tickSize(-height);

    this.yAxis = d3.axisLeft(this.yScale)
      .ticks(Math.max(height / 75, 4))
      .tickSize(-width)
      .tickFormat("");

    // Update the axis and text with the new scale
    this.svg.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(this.xAxis);

    this.svg.select('.y.axis')
      .call(this.yAxis);

    // Force D3 to recalculate and update the line
    this.svg.selectAll('.line')
      .attr("d", d => { return this.line(d.values); });

    // Update the tick marks
    this.xAxis.ticks(Math.max(width / 75, 2));
  };

  render() {
    return <svg width="100%" height="100%" ref={this.chartArea}>
      <defs>
        <linearGradient id="energy"
          gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffae33"></stop>
          <stop offset="66%" stopColor="#ff5742"></stop>
          <stop offset="100%" stopColor="#ff009e"></stop>
        </linearGradient>

        <linearGradient id="battery"
          gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#338fff"></stop>
          <stop offset="100%" stopColor="#40ca88"></stop>
        </linearGradient>

        <linearGradient id="electricity"
          gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0051b2"></stop>
          <stop offset="100%" stopColor="#8828da"></stop>
        </linearGradient>
      </defs>
    </svg>
  }
}

export default LineChartCrs;