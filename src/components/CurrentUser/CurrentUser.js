import React from 'react';
import './CurrentUser.scss';
import { PropTypes } from 'prop-types';
import { Button } from '@material-ui/core';
import user from '../../assets/images/user.svg'

const CurrentUser = props => {
  return <div className='cur_user'>
    <img src={user} className='cur_user_img' alt='user_image' />
    <span className='cur_user_name'>{props.username}</span>
    <div className='cur_user_logout'>
      <Button className='cur_user_logout_btn'><span>Log out</span></Button>
    </div>
  </div>
}

CurrentUser.propsType = {
  username: PropTypes.string.isRequired
}

export default CurrentUser;