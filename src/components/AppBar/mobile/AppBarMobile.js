import React from 'react';
import './AppBarMobile.scss';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../../assets/images/neopis-logo.svg';
import notification from '../../../assets/images/notification.svg';
import CurrentUser from '../../CurrentUser/CurrentUser';


const AppBarMobile = props => {
  return <div className='m_nav_app_bar'>
    <a href='/'><img src={logo} href='/' className='m_nav_logo' alt='logo' /></a>

    <div className='m_nav_user'>
      <CurrentUser />
    </div>

    <IconButton className='m_nav_btn_notification' aria-label="Notification">
    <a href='/#/timeline'><img src={notification} className='m_nav_notification_icon' alt='logo' /></a>
    </IconButton>
  </div>;
};

export default AppBarMobile;