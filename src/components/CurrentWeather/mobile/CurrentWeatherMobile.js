import React from 'react';
import './CurrentWeatherMobile.scss'
import image from '../../../assets/images/weather.svg'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

const CurrentWeatherMobile = props => {
  return <div className='m_weather'>
    <img src={image} className='m_weather_icon' alt='weather icon' />
    <div className='m_weather_temperature'>
      {props.temperature}°C
    </div>
    <div className='m_weather_humidity'>
      {props.humidity}%
    </div>
  </div>
}

CurrentWeatherMobile.propTypes = {
  temperature: PropTypes.number,
  humidity: PropTypes.number
}

const mapStateToProps = state => ({
  temperature: state.weather.temperature,
  humidity: state.weather.humidity
})

export default connect(mapStateToProps)(CurrentWeatherMobile);