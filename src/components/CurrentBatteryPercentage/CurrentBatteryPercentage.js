import React from 'react';
import './CurrentBatteryPercentage.css'
import classnames from 'classnames';
import { PropTypes } from 'prop-types';

const CurrentBatteryPercentage = props => {

  const batteryVolumnStyle = {
    width: props.value
  };

  const batteryClass = classnames({
    battery: !props.mobile,
    m_battery: props.mobile
  });

  return <div className={batteryClass}>
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
  </div>;
}

CurrentBatteryPercentage.propTypes = {
  mobile: PropTypes.bool
}

CurrentBatteryPercentage.defaultProps = {
  mobile: false
}

export default CurrentBatteryPercentage;