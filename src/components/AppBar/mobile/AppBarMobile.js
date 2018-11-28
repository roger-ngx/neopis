import React from 'react';
import './AppBarMobile.scss';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../../assets/images/neopis-logo.svg';
import notification from '../../../assets/images/notification.svg';
import CurrentUser from '../../CurrentUser/CurrentUser';


const AppBarMobile = props => {
  return <div className='m_nav_app_bar'>
    <img src={logo} className='m_nav_logo' alt='logo' />

    <div className='m_nav_user'>
      <CurrentUser />
    </div>

    <IconButton className='m_nav_btn_notification' aria-label="Notification">
      <img src={notification} className='m_nav_notification_icon' alt='logo' />
    </IconButton>
  </div>;
};

export default AppBarMobile;