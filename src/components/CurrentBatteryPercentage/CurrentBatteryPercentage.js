import React from 'react';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';

import './CurrentBatteryPercentage.scss'

const CurrentBatteryPercentage = props => {

  const batteryVolumnStyle = {
    width: props.value + '%'
  };

  const batteryClass = classnames({
    battery: !props.mobile,
    m_battery: props.mobile
  });

  return <a className='card_link' href={`/#/gateways/${props.gwId}/sensors/${props.sensorId}`}>
    <div className={batteryClass}>
      <div className='battery_image'>
        <div style={batteryVolumnStyle} className='battery_volumn'>
        </div>
      </div>
      <div className='battery_info'>
        <div className='battery_value'>
          <span>{props.value}%</span>
        </div>
        <div className='battery_label'>
          <span>배터리량</span>
        </div>
      </div>
    </div>
  </a>
}

CurrentBatteryPercentage.propTypes = {
  mobile: PropTypes.bool,
  value: PropTypes.number.isRequired
}

CurrentBatteryPercentage.defaultProps = {
  mobile: false
}

export default CurrentBatteryPercentage;