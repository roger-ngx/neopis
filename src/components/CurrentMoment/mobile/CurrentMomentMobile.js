import React from 'react';
import { PropTypes } from 'prop-types';
import { withMoment } from '../Moment';

import image from '../../../assets/images/time.svg'
import './CurrentMomentMobile.scss';

const CurrentMomentMobile = (props) => <div className='m_current_moment'>
  <img className='m_current_icon' src={image} alt='time icon' />
  <div className='m_current_time'>
    {props.data.time}
  </div>
  <div className='m_current_date'>
    {props.data.date}
  </div>
</div>

CurrentMomentMobile.propTypes = {
  data: PropTypes.object,
}

export default withMoment(CurrentMomentMobile);