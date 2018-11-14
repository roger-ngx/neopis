import React from 'react';
import './CurrentMomentMobile.css';
import image from '../../../assets/images/time.svg'

const CurrentMomentMobile = props => {
  return <div className='m_current_moment'>
    <img className='m_current_icon' src={image} alt='time icon'/>
    <div className='m_current_time'>
      {props.time}
    </div>
    <div className='m_current_date'>
      {props.date}
    </div>
  </div>
}

export default CurrentMomentMobile;