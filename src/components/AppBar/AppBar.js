import React from 'react';
import './AppBar.css';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import logo from '../../assets/images/neopis-logo.svg';
import notification from '../../assets/images/notification.svg';
import CurrentMoment from '../CurrentMoment/CurrentMoment';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import { CurrentLocation } from '../CurrentLocation/CurrentLocation';

const AppBar = props => {
  return <div className='nav_app_bar'>
    <img src={logo} className='nav_logo' alt='logo' />
    <div className='nav_moment'>
      <CurrentMoment date='2018 / 10 / 26 / 수요일' time='15 : 30 : 00' />
    </div>
    <div className='nav_weather'>
      <CurrentWeather temperature='23°' humidity='75%' />
    </div>
    <div className='nav_location'>
      <CurrentLocation location='강원도 고성군 간성읍 금수리 산 40-4' />
    </div>
    <Button className='nav_btn_login' variant="extendedFab" aria-label="Log in">
      <span>Log in</span>
    </Button>

    <IconButton className='nav_btn_notification' aria-label="Notification">
      <img src={notification} className='nav_logo' alt='logo' />
    </IconButton>
  </div>;
};

export default AppBar;