import React from 'react';
import './CurrentLocationMobile.scss';
import image from '../../../assets/images/location.svg'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

const CurrentLocationMobile = props =>
  <div className='m_location'>
    <img src={image} className='m_location_icon' alt='location icon' />
    <span className='m_location_address'>{props.location}</span>
  </div>

CurrentLocationMobile.propTypes = {
  location: PropTypes.string
}

const mapStateToProps = state => ({
  location: state.location
});

export default connect(mapStateToProps)(CurrentLocationMobile);