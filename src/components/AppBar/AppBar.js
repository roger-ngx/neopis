import React from 'react';
import IconButton from '@material-ui/core/IconButton';

import './AppBar.scss';
import logo from '../../assets/images/neopis-logo.svg';
import notification from '../../assets/images/notification.svg';
import logout from '../../assets/images/logout.svg';

import CurrentMoment from '../CurrentMoment/CurrentMoment';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import CurrentLocation from '../CurrentLocation/CurrentLocation';
import userService from '../../services/userService';

const AppBar = (props) => {

  function handleLogout() {
    userService.logout().then(res => {
      window.location = "/#/login"
    });
  }

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

    {/* <div className='nav_user'>
      <CurrentUser />
    </div> */}
    <div className='nav_btn_notification'>
      <IconButton aria-label="Notification">
        <a href='/#/timeline'><img src={notification} href='/#/timeline' className='nav_logo' alt='logo' /></a>
      </IconButton>
    </div>

    <div className='nav_btn_logout'>
      <IconButton aria-label="Notification" onClick={handleLogout}>
        <a><img src={logout} className='m_nav_notification_icon' alt='logo' /></a>
      </IconButton>
    </div>

  </div>;
};

export default AppBar;