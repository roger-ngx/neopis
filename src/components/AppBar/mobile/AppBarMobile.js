import React from 'react';
import './AppBarMobile.scss';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../../assets/images/neopis-logo.svg';
import notification from '../../../assets/images/notification.svg';
import logout from '../../../assets/images/logout.svg';
import userService from '../../services/userService';

const AppBarMobile = () => {

  function handleLogout() {
    userService.logout().then(res => {
      window.location = "/#/login"
    });
  }

  return <div className='m_nav_app_bar'>
    <a href='/'><img src={logo} href='/' className='m_nav_logo' alt='logo' /></a>

    <div className='m_nav_btn_notification'>
      <IconButton aria-label="Notification">
        <a href='/#/timeline'><img src={notification} className='m_nav_notification_icon' alt='logo' /></a>
      </IconButton>
    </div>

    <div className='m_nav_btn_logout'>
      <IconButton aria-label="Logout" onClick={handleLogout}>
        <a><img src={logout} className='m_nav_notification_icon' alt='logo' /></a>
      </IconButton>
    </div>
  </div>;
};

export default AppBarMobile;