import React from 'react';
import './CurrentLocation.css';
import image from '../../assets/images/location.svg'
import { connect } from 'react-redux';

const CurrentLocation = props =>
  <div className='location'>
    <img src={image} className='location_icon' alt='location icon' />
    <span className='location_address'>{props.location}</span>
  </div>

const mapStateToProps = state => ({
  location: state.location
});

export default connect(mapStateToProps)(CurrentLocation);

