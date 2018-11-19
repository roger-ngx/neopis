import React from 'react';
import './CurrentElectricityValueMobile.css';
import classNames from 'classnames';

const CurrentElectricityValueMobile = (props) => {

  const separatorClass = classNames({
    'm_ev_separator': true,
    'ev_separator': true,
    'gbg_source': +props.type === 1,
    'gbg_battery': +props.type === 2,
    'gbg_electricity': +props.type === 3
  })

  return <div className='electricity_value'>
    <div className='ev_value_unit m_ev_value_unit'>
      <span className='ev_value m_ev_value'>
        {props.value}
      </span>
      <div className='ev_unit m_ev_unit'>
        {props.unit}
      </div>
    </div>
    <div className={separatorClass}></div>
    <span className='ev_description'>
      {props.description}
    </span>
  </div>
}

export default CurrentElectricityValueMobile;