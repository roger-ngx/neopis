import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import image from '../../../assets/images/weather.svg';
import './CurrentWeatherMobile.scss'

const WeatherImg = React.lazy(() => import('../WeatherImage'));

const CurrentWeatherMobile = props => {

  return <div className='m_weather'>
    <React.Suspense fallback={<img src={image} className='weather_icon' alt='weather icon' />}>
      <WeatherImg weather={props.weather} />
    </React.Suspense>
    <div className='m_weather_values'>
      <div className='m_weather_temperature'>
        {props.temperature}°C
    </div>
      <div className='m_weather_humidity'>
        {props.humidity}%
    </div>
    </div>
  </div>
}

CurrentWeatherMobile.propTypes = {
  temperature: PropTypes.number,
  humidity: PropTypes.number,
  weather: PropTypes.string
}

const mapStateToProps = state => ({
  temperature: state.weather.temperature,
  humidity: state.weather.humidity,
  weather: state.weather.weather
})

export default connect(mapStateToProps)(CurrentWeatherMobile);