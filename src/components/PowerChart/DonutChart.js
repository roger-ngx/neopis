import React, { Component } from 'react';
import * as d3 from 'd3'
import { PropTypes } from 'prop-types';
import './PowerDonutChart.scss';
import { SOURCE, BATTERY_1, ELECTRICITY } from '../CurrentElectricityValue/mobile/CurrentElectricityValueMobile';

const colors = ['#ff5742', '#40ca88', '#338fff', '#2d2e2f'];
class DonutChart extends Component {

    constructor(props) {
        super(props);

        switch (props.type) {
            case SOURCE:
                this.colors = ['#ff5742', '#2d2e2f'];
                break;

            case BATTERY_1:
                this.colors = ['#40ca88', '#2d2e2f'];
                break;

            case ELECTRICITY:
                this.colors = ['#338fff', '#2d2e2f'];
                break;

            default:
        }
    }


    render() {
        const data = [this.props.percentage, 100 - this.props.percentage];

        const sectionAngles = d3.pie()(data)

        const w = this.props.size;
        const h = this.props.size;
        const r2 = this.props.size / 2;
        const r1 = r2 - 10;

        const noOfSeg = sectionAngles.length;

        const arcs = [];

        for (let i = 0; i < noOfSeg; i++) {

            const startAngle = sectionAngles[i].startAngle;
            const stopAngle = sectionAngles[i].endAngle;

            const arc = d3.arc()
                .innerRadius(r1)
                .outerRadius(r2)
                .startAngle(startAngle)
                // Add a fraction of a degree to the end angle so that the arcs overlap 
                // slightly and we don't see the gap caused by antialiasing.
                .endAngle(stopAngle + 0.005)(sectionAngles[i]);

            arcs.push(arc);
        }

        return <svg width={w} height={h + 25}>
            <g transform={`translate(${w / 2}, ${h / 2})`}>
                {
                    arcs.map((arc, index) => (
                        <path
                            key={index}
                            d={arc}
                            fill={this.colors[index]}
                        />
                    ))
                }

                <text className='pie_value'
                    fill='#ffffff'
                    text-anchor="middle">
                    {this.props.percentage}%
                </text>

                <text className='pie_unit'
                    fill='#b8b8c2'
                    text-anchor="middle"
                    y={20}>
                    {this.props.electricity}
                </text>

                <text className='pie_description'
                    fill='#b8b8c2'
                    text-anchor="middle"
                    y={h / 2 + 20}>
                    {this.props.description}
                </text>
            </g>
        </svg>
    }
}

DonutChart.propTypes = {
    size: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    electricity: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}

export default DonutChart;