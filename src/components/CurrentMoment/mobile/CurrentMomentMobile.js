import React, { Component } from 'react';
import './CurrentMomentMobile.scss';
import image from '../../../assets/images/time.svg'
// import { connect } from 'react-redux';
// import { PropTypes } from 'prop-types';
import * as moment from 'moment';
import 'moment/locale/ko';

class CurrentMomentMobile extends Component {
  constructor(props) {
    super(props);
    moment.locale('kr');

    this.state = {
      date: '', 
      time: ''
    }
  }

  componentDidMount() {
    setInterval(() => {
      const [date, time] = moment().format('YYYY / MM / DD / dddd,HH:mm:ss').split(',');
      this.setState({date, time})
    }, 1000);
  }

  render() {
    return <div className='m_current_moment'>
      <img className='m_current_icon' src={image} alt='time icon' />
      <div className='m_current_time'>
        {this.state.time}
      </div>
      <div className='m_current_date'>
        {this.state.date}
      </div>
    </div>
  }
}

export default CurrentMomentMobile;

  // CurrentMomentMobile.propTypes = {
  //   data: PropTypes.string,
  //   time: PropTypes.string
  // }

  // const mapStateToProps = state => ({
  //   date: state.dateTime.date,
  //   time: state.dateTime.time
  // });

  // export default connect(mapStateToProps)(CurrentMomentMobile);