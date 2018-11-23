import React from 'react';
import './AppBarMobile.scss';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import logo from '../../../assets/images/neopis-logo.svg';
import notification from '../../../assets/images/notification.svg';


const AppBarMobile = props => {
  return <div className='m_nav_app_bar'>
    <img src={logo} className='m_nav_logo' alt='logo' />

    <div className='m_nav_div_login'>
      <Button className='m_nav_btn_login' variant="extendedFab" aria-label="Log in">
        <span className='m_nav_login_font'>Log in</span>
      </Button>
    </div>

    <IconButton className='m_nav_btn_notification' aria-label="Notification">
      <img src={notification} className='m_nav_notification_icon' alt='logo' />
    </IconButton>
  </div>;
};

export default AppBarMobile;