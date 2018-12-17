import React from 'react';
import { withMoment } from './Moment';
import { PropTypes } from 'prop-types';

import './CurrentMoment.scss';
import image from '../../assets/images/time.svg'

const CurrentMoment = (props) => <div className='current_moment'>
  <img className='current_icon' src={image} alt='time icon' />
  <div className='current_date'>
    {props.data.date}
  </div>
  <div className='current_time'>
    {props.data.time}
  </div>
</div>

CurrentMoment.propTypes = {
  data: PropTypes.object,
}

export default withMoment(CurrentMoment);