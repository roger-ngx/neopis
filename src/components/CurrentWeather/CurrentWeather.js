import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import './CurrentWeather.scss'
const images = require.context('../../assets/images/weather');

const CurrentWeather = props => {
  function getWeatherIconName() {
    function _isDayTime() {
      const hour = (new Date()).getHours();
      return hour > 6 && hour < 18;
    }
    
    if(!props.weather) {
      return null;
    }
    
    let imageName = props.weather;
    
    if(!_isDayTime()) {
      imageName += '_NIGHT';
    }
    
    imageName += '.png';
    
    return images(`./${imageName}`);
  };

  return <div className='weather'>
    <img src={getWeatherIconName()} className='weather_icon' alt='weather icon' />
    <div className='weather_temperature'>
      {props.temperature}°C
    </div>
    <div className='weather_humidity'>
      {props.humidity}%
    </div>
  </div>
}

CurrentWeather.propTypes = {
  temperature: PropTypes.number,
  humidity: PropTypes.number,
  weather: PropTypes.string
}

const mapStateToProps = state => ({
  temperature: state.weather.temperature,
  humidity: state.weather.humidity,
  weather: state.weather.weather
})

export default connect(mapStateToProps)(CurrentWeather);