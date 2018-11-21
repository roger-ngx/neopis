import React from 'react';
import './DonutChartWithCss.css'
import { SOURCE, BATTERY_2, BATTERY_1, ELECTRICITY } from '../CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import { PropTypes } from 'prop-types';


const getBackground = function (type, percentage) {
  switch (type) {
    case SOURCE:
      return `conic-gradient(#ffae33, #ff009e, #ffae33 ${percentage}%, #2e2d2f 0)`;

    case BATTERY_1:
    case BATTERY_2:
      return `conic-gradient(#fac600, #42e27f, #338fff ${percentage}%, #2e2d2f 0)`;

    case ELECTRICITY:
      return `conic-gradient(#0051b2, #8828da, #ff6878 ${percentage}%, #2e2d2f 0)`;

    default:
      return `conic-gradient(#ffae33, #ff009e, #ffae33 ${percentage}%, #2e2d2f 0)`;
  }
};

const DonutChartWithCss = (props) => {

  const outerPieStyle = {
    width: props.size + 'px',
    height: props.size + 'px',
    backgroundImage: getBackground(props.type, props.percentage)
  }

  const innerPieStyle = {
    width: (props.size - 20) + 'px',
    height: (props.size - 20) + 'px'
  }

  return <div className='neopis_pie'>
    <div style={outerPieStyle} className='outer_pie'>
      <div style={innerPieStyle} className='inner_pie'>
        <div className='pie_data'>
          <span className='pie_value'>{props.percentage}%</span>
          <span className='pie_unit'>{props.electricity}</span>
        </div>
      </div>
    </div>
    <span className='pie_description'>{props.description}</span>
  </div>
}

DonutChartWithCss.propTypes = {
  size: PropTypes.number.isRequired
}

export default DonutChartWithCss;