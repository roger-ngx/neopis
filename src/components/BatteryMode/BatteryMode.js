import React from 'react';
import './BatteryMode.scss';
export const ABNORMAL = 1, MANUAL = 2, AUTOMATIC = 3;

const BatteryMode = props => {

  let status = (status) => {
    if(status === ABNORMAL) return 'Abnormal';
    if(status === MANUAL) return 'Manual';
    if(status === AUTOMATIC) return 'Automatic';
  }

  return <div className='bm_container'>
    <span className='bm_content'>
      {status(props.status)}
    </span>
  </div>
}

export default BatteryMode;