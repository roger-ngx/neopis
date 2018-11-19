import React from 'react';
import './BatteryMode.css';

const BatteryMode = props => {

  return <div className='bm_container'>
    <span className='bm_content'>
      {props.status}
    </span>
  </div>
}

export default BatteryMode;