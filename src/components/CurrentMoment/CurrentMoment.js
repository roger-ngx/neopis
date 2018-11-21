import React from 'react';
import './CurrentMoment.css';
import image from '../../assets/images/time.svg'
import { connect } from 'react-redux';

const CurrentMoment = props => {
  return <div className='current_moment'>
    <img className='current_icon' src={image} alt='time icon'/>
    <div className='current_date'>
      {props.date}
    </div>
    <div className='current_time'>
      {props.time}
    </div>
  </div>
}

const mapStateToProps = state => ({
  date: state.dateTime.date,
  time: state.dateTime.time
});

export default connect(mapStateToProps)(CurrentMoment);