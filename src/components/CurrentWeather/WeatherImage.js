import React from 'react';

const WeatherImg = (props) => {
    const images = require.context('../../assets/images/weather');

    function getWeatherIconName() {
        function _isDayTime() {
            const hour = (new Date()).getHours();
            return hour > 6 && hour < 18;
        }

        if (!props.weather) {
            return null;
        }

        let imageName = props.weather;

        if (!_isDayTime()) {
            imageName += '_NIGHT';
        }

        imageName += '.png';

        return images(`./${imageName}`);
    };

    return <img src={getWeatherIconName()} className='weather_icon' alt='weather icon' />
}

export default WeatherImg;
