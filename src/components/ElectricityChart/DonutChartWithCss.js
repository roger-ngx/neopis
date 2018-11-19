import React from 'react';
import './DonutChartWithCss.css'

const DonutChartWithCss = (props) => {
  const backgroundColor = {
    backgroundImage: `conic-gradient(#fac600, #42e27f, #338fff ${props.percentage}, #2e2d2f 0)`
  };

  return <div>
    <div style={backgroundColor} className='outer_pie'>
      <div className='inner_pie'>
        <div className='pie_data'>
          <span className='pie_value'>{props.percentage}</span>
          <span className='pie_unit'>{props.electricity}</span>
        </div>
      </div>
    </div>
  </div>
}

export default DonutChartWithCss;