import React from 'react';
import './CurrentBatteryPercentage.css'

const CurrentBatteryPercentage = props => {
  return <div className='battery'>
    <div className='battery_image'>
      <div className='battery_volumn'>
      </div>
    </div>
    <div className='battery_info'>
      <div className='battery_value'>
        <span>70%</span>
      </div>
      <div className='battery_label'>
        <span>배터리량</span>
      </div>
    </div>
  </div>;
}

export default CurrentBatteryPercentage;