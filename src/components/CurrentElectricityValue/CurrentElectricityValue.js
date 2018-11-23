import React from 'react';
import './style.scss';
import './CurrentElectricityValue.scss';
import classnames from 'classnames'
import { SOURCE, BATTERY_1, BATTERY_2, ELECTRICITY } from './mobile/CurrentElectricityValueMobile';
import { PropTypes } from 'prop-types';

const CurrentElectricityValue = (props) =>{

  const separatorClass = classnames({
    'ev_separator': true,
    'd_ev_separator': true,
    'gbg_source': +props.type === SOURCE, 
    'gbg_battery_1': +props.type === BATTERY_1, 
    'gbg_battery_2': +props.type === BATTERY_2, 
    'gbg_electricity': +props.type === ELECTRICITY
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

CurrentElectricityValue.propTypes = {
  type: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default CurrentElectricityValue;