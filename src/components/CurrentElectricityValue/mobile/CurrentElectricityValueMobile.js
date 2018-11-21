import React from 'react';
import './CurrentElectricityValueMobile.css';
import classNames from 'classnames';

export const SOURCE = 1;
export const BATTERY_1 = 2;
export const BATTERY_2 = 3;
export const ELECTRICITY = 4;

const CurrentElectricityValueMobile = (props) => {

  const separatorClass = classNames({
    'm_ev_separator': true,
    'ev_separator': true,
    'gbg_source': +props.type === SOURCE,
    'gbg_battery_1': +props.type === BATTERY_1,
    'gbg_battery_2': +props.type === BATTERY_2,
    'gbg_electricity': +props.type === ELECTRICITY
  })

  return <div className='electricity_value m_electricity_value'>
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