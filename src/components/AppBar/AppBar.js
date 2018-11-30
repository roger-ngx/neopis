import React from 'react';
import './AppBar.scss';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import logo from '../../assets/images/neopis-logo.svg';
import notification from '../../assets/images/notification.svg';
import CurrentMoment from '../CurrentMoment/CurrentMoment';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import CurrentLocation from '../CurrentLocation/CurrentLocation';
import CurrentUser from '../CurrentUser/CurrentUser';

const AppBar = props => {
  return <div className='nav_app_bar'>
    <a href='/'><img src={logo} href='/' className='nav_logo' alt='logo' /></a>
    <div className='nav_moment'>
      <CurrentMoment />
    </div>
    <div className='nav_weather'>
      <CurrentWeather />
    </div>
    <div className='nav_location'>
      <CurrentLocation />
    </div>
    {/* <div className='nav_login_div'>
      <Button className='nav_btn_login' variant="extendedFab" aria-label="Log in">
        <span>Log in</span>
      </Button>
    </div> */}
    <div className='nav_user'>
      <CurrentUser />
    </div>

    <IconButton className='nav_btn_notification' aria-label="Notification">
    <a href='/#/timeline'><img src={notification} href='/#/timeline' className='nav_logo' alt='logo' /></a>
    </IconButton>
  </div>;
};

export default AppBar;