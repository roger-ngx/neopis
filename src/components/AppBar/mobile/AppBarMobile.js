import React, { Component } from 'react';
import './AppBarMobile.scss';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../../assets/images/neopis-logo.svg';
import notification from '../../../assets/images/notification.svg';
import logout from '../../../assets/images/logout.svg';
import userService from '../../../services/userService';
import LogoutDialog from '../LogoutDialog/LogoutDialog';

class AppBarMobile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: false
    };

    this.onLogoutBtnClicked = this.onLogoutBtnClicked.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(logout) {
    if (logout) {
      userService.logout().then(res => {
        window.location = "/#/login"
      });
    } else {
      this.setState({
        isDialogOpen: false
      })
    }
  }

  onLogoutBtnClicked() {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  render() {
    return <div className='m_nav_app_bar'>
      <a href='/#/dashboard'><img src={logo} className='m_nav_logo' alt='logo' /></a>

      <div className='m_nav_btn_notification'>
        <IconButton aria-label="Notification">
          <a href='/#/timeline'><img src={notification} className='m_nav_notification_icon' alt='logo' /></a>
        </IconButton>
      </div>

      <div className='m_nav_btn_logout'>
        <IconButton aria-label="Logout" onClick={this.onLogoutBtnClicked}>
          <a><img src={logout} className='m_nav_notification_icon' alt='logo' /></a>
        </IconButton>
      </div>
      <LogoutDialog
        open={this.state.isDialogOpen}
        onClose={this.handleLogout} />
    </div>;
  }
};

export default AppBarMobile;