import React from 'react';
import { scaleOrdinal } from 'd3-scale';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import { csvParse } from 'd3-dsv';

// Same as data.csv
import dataCsv from '../ElectricityChart/data';

import './chart.css';

const width = 128,
  height = 128,
  radius = Math.min(width, height) / 2;

const color = scaleOrdinal().range([
  '#98abc5',
  '#8a89a6',
  '#7b6888',
  '#6b486b',
  '#a05d56',
  '#d0743c',
  '#ff8c00',
]);

const arc = d3Arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 20);

const pie = d3Pie()
  .sort(null)
  .value(function (d) {
    return d.population;
  });

const data = pie(
  csvParse(dataCsv, d => {
    d.population = +d.population;
    return d;
  })
);

// <DonutChart/>
const DonutChart = () => {
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="MyGradient">
          <stop offset="5%" stop-color="#338fff" />
          <stop offset="52%" stop-color="#42e27f" />
          <stop offset="75%" stop-color="#fac600" />
          <stop offset="95%" stop-color="#338fff" />
        </linearGradient>
      </defs>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {data.map(d => (
          <g className="arc" key={`a${d.data.age}`}>
            <path d={arc(d)} fill="url(#MyGradient)" />
            <text dy=".35em">100%</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default DonutChart;