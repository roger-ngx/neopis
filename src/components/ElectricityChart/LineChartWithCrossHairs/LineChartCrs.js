import React, { Component } from 'react';
import './LineChartCrs.scss';
import * as d3 from 'd3';
import { chartDataSelector } from '../../../store/neopisSelectors';
import { connect } from 'react-redux';

export const ENERGY = 0;
export const BATTERY = 1;
export const ELECTRICITY = 2;

const XAxis = props => {
  const xScale = d3.scaleTime()
    .range([0, props.width]);

  const xAxis = d3.axisBottom(xScale)
    .ticks(Math.max(props.width / 75, 4))
    .tickSize(-props.height);

  xScale.domain(d3.extent(props.data.values, function (d) {
    return d.time;
  }));

  d3.select(".x").attr("transform", "translate(0," + props.height + ")").call(xAxis);

  return <g className='x axis'></g>
}

const YAxis = props => {
  const yScale = d3.scaleLinear()
    .range([props.height, 0]);

  const yAxis = d3.axisLeft(yScale)
    .ticks(Math.max(props.height / 75, 4))
    .tickSize(-props.width)
    .tickFormat("");

  yScale.domain([
    d3.min(props.data, function (c) {
      return d3.min(c.values, function (v) {
        return v.value;
      });
    }),
    d3.max(props.data, function (c) {
      return d3.max(c.values, function (v) {
        return v.value;
      });
    })
  ]);

  d3.select(".y").call(yAxis);

  return <g className='y axis'></g>
}

const Line = props => {
  const line = d3.line()
    .curve(d3.curveCatmullRomOpen)
    .x(d => {
      return props.xScale(d.time);
    })
    .y(d => {
      return props.yScale(d.value);
    });

  return <g className='city'>
    <path className='line' d={line(props.data.values)} stroke={props.stroke}></path>
  </g>
}

const Lines = props => {
  const xScale = d3.scaleTime()
    .range([0, props.width]);

  xScale.domain(d3.extent(props.data[0].values, function (d) {
    return d.time;
  }));

  const yScale = d3.scaleLinear()
    .range([props.height, 0]);

  yScale.domain([
    d3.min(props.data, function (c) {
      return d3.min(c.values, function (v) {
        return v.value;
      });
    }),
    d3.max(props.data, function (c) {
      return d3.max(c.values, function (v) {
        return v.value;
      });
    })
  ]);

  return <>
    {props.data.map(
      (data, i) => <Line key={i}
        xScale={xScale}
        yScale={yScale}
        data={data}
        stroke={props.gradients[i]}>
      </Line>)}
  </>
}

const MouseOverEffect = props => {
  var lines = document.getElementsByClassName('line');

  const yScale = d3.scaleLinear()
    .range([props.height, 0]);

  yScale.domain([
    d3.min(props.data, function (c) {
      return d3.min(c.values, function (v) {
        return v.value;
      });
    }),
    d3.max(props.data, function (c) {
      return d3.max(c.values, function (v) {
        return v.value;
      });
    })
  ]);

  var mousePerLine = d3.select('g').selectAll('.mouse-per-line')
    .data(props.data)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function (d, i) {
      return props.gradients[i];
    })
    .style("fill", "none")
    .style("stroke-width", "2px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  d3.select('rect') // append a rect to catch mouse movements on canvas
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
          var d = "M" + mouse[0] + "," + props.height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function (d, i) {

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
            .text(yScale.invert(pos.y).toFixed(2))
            .attr("fill", 'white');

          return "translate(" + mouse[0] + "," + pos.y + ")";
        });
    });

  d3.select('.mouse-line')
    .style("stroke", "white")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  return <g className='mouse-over-effects'>
    <path className="mouse-line"></path>
    <rect width={props.width} height={props.height} fill="none" pointerEvents="all"></rect>
  </g>
}

class LineChartCrs extends Component {

  constructor(props) {
    super(props);
    this.chartArea = React.createRef();
    this.gradients = ['url(#energy)', 'url(#battery)', 'url(#electricity)'];
    this.margin = {
      top: 20,
      right: 30,
      bottom: 20,
      left: 30
    };

    this.state = {
      width: 0,
      height: 0,
      data: [],
      cities: []
    };
  }

  componentDidMount() {
    let width = this.chartArea.current.clientWidth - this.margin.left - this.margin.right;
    let height = this.chartArea.current.clientHeight - this.margin.top - this.margin.bottom;

    this.setState({ width, height })

    d3.select(window).on('resize', this.resize.bind(this));
  }

  resize() {
    var width = this.chartArea.current.clientWidth - this.margin.left - this.margin.right,
      height = this.chartArea.current.clientHeight - this.margin.top - this.margin.bottom;

    this.setState({ width, height })
  };

  render() {

    return <svg width="100%" height="100%" ref={this.chartArea}>
      <g transform={`translate(${this.margin.left},${this.margin.top})`}>
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

        <XAxis width={this.state.width} height={this.state.height} data={this.props.data[0]} />

        <YAxis width={this.state.width} height={this.state.height} data={this.props.data} />

        <Lines width={this.state.width} height={this.state.height} data={this.props.data} gradients={this.gradients}></Lines>

        <MouseOverEffect width={this.state.width} height={this.state.height} data={this.props.data} gradients={this.gradients} />
      </g>
    </svg>
  }
}

const mapStateToProps = state => ({
  data: chartDataSelector(state)
})

export default connect(mapStateToProps)(LineChartCrs);
// export default LineChartCrs;