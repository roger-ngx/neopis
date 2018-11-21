import React from 'react';
import './CurrentWeatherMobile.css'
import image from '../../../assets/images/weather.svg'
import { connect } from 'react-redux';

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

const mapStateToProps = state => ({
  temperature: state.weather.temperature,
  humidity: state.weather.humidity
})

export default connect(mapStateToProps)(CurrentWeatherMobile);