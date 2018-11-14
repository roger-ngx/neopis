import React from 'react';
import './CurrentWeather.css'
import image from '../../assets/images/weather.svg'

const CurrentWeather = props => {
  return <div className='weather'>
    <img src={image} className='weather_icon' alt='weather icon' />
    <div className='weather_temperature'>
      {props.temperature}
    </div>
    <div className='weather_humidity'>
      {props.humidity}
    </div>
  </div>
}

export default CurrentWeather;