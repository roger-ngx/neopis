import React from 'react';
import './CurrentMoment.css';
import image from '../../assets/images/time.svg'

const CurrentMoment = props => {
  return <div className='current_moment'>
    <img className='current_icon' src={image} alt='time icon'/>
    <div className='current_date'>
      {props.date}
    </div>
    <div className='current_time'>
      {props.time}
    </div>
  </div>
}

export default CurrentMoment;