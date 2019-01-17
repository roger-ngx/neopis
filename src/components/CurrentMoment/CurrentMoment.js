import React from 'react';
import { withMoment } from './Moment';
import { PropTypes } from 'prop-types';

import './CurrentMoment.scss';
import image from '../../assets/images/time.svg'

export const CurrentMoment_ = (props) => <div className='current_moment'>
  <img className='current_icon' src={image} alt='time icon' />
  <div className='current_date'>
    {props.date}
  </div>
  <div className='current_time'>
    {props.time}
  </div>
</div>

CurrentMoment_.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
}

export default withMoment(CurrentMoment_);