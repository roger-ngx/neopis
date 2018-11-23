import React from 'react';
import './AppBar.scss';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import logo from '../../assets/images/neopis-logo.svg';
import notification from '../../assets/images/notification.svg';
import CurrentMoment from '../CurrentMoment/CurrentMoment';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import CurrentLocation from '../CurrentLocation/CurrentLocation';

const AppBar = props => {
  return <div className='nav_app_bar'>
    <img src={logo} className='nav_logo' alt='logo' />
    <div className='nav_moment'>
      <CurrentMoment />
    </div>
    <div className='nav_weather'>
      <CurrentWeather />
    </div>
    <div className='nav_location'>
      <CurrentLocation />
    </div>
    <div className='nav_login_div'>
      <Button className='nav_btn_login' variant="extendedFab" aria-label="Log in">
        <span>Log in</span>
      </Button>
    </div>

    <IconButton className='nav_btn_notification' aria-label="Notification">
      <img src={notification} className='nav_logo' alt='logo' />
    </IconButton>
  </div>;
};

export default AppBar;