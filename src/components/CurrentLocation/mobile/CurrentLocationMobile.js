import React from 'react';
import './CurrentLocationMobile.css';
import image from '../../../assets/images/location.svg'
import { connect } from 'react-redux';

const CurrentLocationMobile = props =>
  <div className='m_location'>
    <img src={image} className='m_location_icon' alt='location icon' />
    <span className='m_location_address'>{props.location}</span>
  </div>

const mapStateToProps = state => ({
  location: state.location
});

export default connect(mapStateToProps)(CurrentLocationMobile);