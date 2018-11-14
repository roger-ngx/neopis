import React from 'react';
import './CurrentWeatherMobile.css'
import image from '../../../assets/images/weather.svg'

const CurrentWeatherMobile = props => {
  return <div className='m_weather'>
    <img src={image} className='m_weather_icon' alt='weather icon' />
    <div className='m_weather_temperature'>
      {props.temperature}
    </div>
    <div className='m_weather_humidity'>
      {props.humidity}
    </div>
  </div>
}

export default CurrentWeatherMobile;