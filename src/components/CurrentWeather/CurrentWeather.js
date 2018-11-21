import React from 'react';
import './CurrentWeather.css'
import image from '../../assets/images/weather.svg'
import { connect } from 'react-redux';

const CurrentWeather = props => {
  return <div className='weather'>
    <img src={image} className='weather_icon' alt='weather icon' />
    <div className='weather_temperature'>
      {props.temperature}°C
    </div>
    <div className='weather_humidity'>
      {props.humidity}%
    </div>
  </div>
}

const mapStateToProps = state => ({
  temperature: state.weather.temperature,
  humidity: state.weather.humidity
})

export default connect(mapStateToProps)(CurrentWeather);