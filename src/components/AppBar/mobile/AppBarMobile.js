import React from 'react';
import './AppBarMobile.scss';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../../assets/images/neopis-logo.svg';
import notification from '../../../assets/images/notification.svg';
import logout from '../../../assets/images/logout.svg';


const AppBarMobile = props => {
  return <div className='m_nav_app_bar'>
    <a href='/'><img src={logo} href='/' className='m_nav_logo' alt='logo' /></a>

    {/* <div className='m_nav_user'>
      <CurrentUser />
    </div> */}

    <div className='m_nav_right'>
      <IconButton className='m_nav_btn_notification' aria-label="Notification">
        <a href='/#/timeline'><img src={notification} className='m_nav_notification_icon' alt='logo' /></a>
      </IconButton>
    </div>

    <div>
      <IconButton className='m_nav_btn_notification' aria-label="Notification">
        <a href='/#/login'><img src={logout} className='m_nav_notification_icon' alt='logo' /></a>
      </IconButton>
    </div>
  </div>;
};

export default AppBarMobile;