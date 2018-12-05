import React from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames'

import './style.scss';
import './CurrentElectricityValue.scss';
import { SOURCE, BATTERY_1, BATTERY_2, ELECTRICITY } from './mobile/CurrentElectricityValueMobile';

const CurrentElectricityValue = (props) => {

  const separatorClass = classnames({
    'ev_separator': true,
    'd_ev_separator': true,
    'gbg_deactive': !props.isActive,
    'gbg_source': +props.type === SOURCE,
    'gbg_battery_1': +props.type === BATTERY_1 && props.isActive,
    'gbg_battery_2': +props.type === BATTERY_2 && props.isActive,
    'gbg_electricity': +props.type === ELECTRICITY
  });

  return <a className='card_link' href={`/#/gateways/${props.gwId}/sensors/${props.sensorId}`}>
    <div className='electricity_value'>
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
  </a>
}

CurrentElectricityValue.propTypes = {
  type: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default CurrentElectricityValue;