import React from 'react';
import './CurrentMomentMobile.scss';
import image from '../../../assets/images/time.svg'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

const CurrentMomentMobile = props => {
  return <div className='m_current_moment'>
    <img className='m_current_icon' src={image} alt='time icon'/>
    <div className='m_current_time'>
      {props.time}
    </div>
    <div className='m_current_date'>
      {props.date}
    </div>
  </div>
}

CurrentMomentMobile.propTypes = {
  data: PropTypes.string,
  time: PropTypes.string
}

const mapStateToProps = state => ({
  date: state.dateTime.date,
  time: state.dateTime.time
});

export default connect(mapStateToProps)(CurrentMomentMobile);