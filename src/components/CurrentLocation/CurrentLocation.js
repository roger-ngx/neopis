import React from 'react';
import './CurrentLocation.scss';
import image from '../../assets/images/location.svg'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

const CurrentLocation = props =>
  <div className='location'>
    <img src={image} className='location_icon' alt='location icon' />
    <span className='location_address'>{props.location}</span>
  </div>

CurrentLocation.propTypes = {
  location: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  location: state.location
});

export default connect(mapStateToProps)(CurrentLocation);

