import React from 'react';
import './style.css';
import './CurrentElectricityValue.css';
import classnames from 'classnames'

const CurrentElectricityValue = (props) =>{

  const separatorClass = classnames({
    'ev_separator': true,
    'd_ev_separator': true,
    'gbg_source': +props.type === 1, 
    'gbg_battery': +props.type === 2, 
    'gbg_electricity': +props.type === 3
  })

  return <div className='electricity_value'>
    <span className='ev_value d_ev_value'>
      {props.value}
    </span>
    <div className='ev_unit d_ev_unit'>
      {props.unit}
    </div>
    <div className={separatorClass}></div>
    <span className='ev_description'>
      {props.description}
    </span>
  </div>
}

export default CurrentElectricityValue;