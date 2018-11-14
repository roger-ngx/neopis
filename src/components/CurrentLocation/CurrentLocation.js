import React from 'react';
import './CurrentLocation.css';
import image from '../../assets/images/location.svg'

export const CurrentLocation = props =>
  <div className='location'>
    <img src={image} className='location_icon' alt='location icon' />
    <span className='location_address'>{props.location}</span>
  </div>