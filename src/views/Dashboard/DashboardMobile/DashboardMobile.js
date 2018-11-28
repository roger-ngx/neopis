import React from 'react';
import './DashboardMobile.scss';
import withStyles from "@material-ui/core/styles/withStyles";
import CurrentMomentMobile from '../../../components/CurrentMoment/mobile/CurrentMomentMobile';
import CurrentWeatherMobile from '../../../components/CurrentWeather/mobile/CurrentWeatherMobile';
import CurrentLocationMobile from '../../../components/CurrentLocation/mobile/CurrentLocationMobile';
import Grid from '@material-ui/core/Grid';
import CardMobile from '../Card/mobile/CardMobile';
import battery1 from '../../../assets/images/battery-1.svg';
import battery2 from '../../../assets/images/battery-2.svg';
import electricity from '../../../assets/images/electricity.svg';
import energy from '../../../assets/images/energy.svg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppBarMobile from '../../../components/AppBar/mobile/AppBarMobile';
import { SOURCE, BATTERY_1, BATTERY_2, ELECTRICITY } from '../../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import { connect } from 'react-redux';
import { updateESSDischarge, getUsersMe } from '../../../store/actionCreators';
import LineChartCrs from '../../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';
import { getInitialDataForChart } from '../../../store/actionCreators';
import _ from 'lodash';

const styles = {
  root: {
    flexGrow: 1,
  },
  m_db_title: {
    textAlign: 'center',
  },
  dotClass: {
    top: 0
  }
}

class DashboardMobile extends React.Component {

  componentDidMount() {
    this.props.onFetchingCurrentUser();

    const currentTime = new Date();
    const minTime = currentTime - 24 * 60 * 60 * 1000;

    const sensorIds = [
      'temperature-9786c9c4c95840228ed4fdb30bf9e5a4-1',
      'temperature-9786c9c4c95840228ed4fdb30bf9e5a4-2',
      'temperature-9786c9c4c95840228ed4fdb30bf9e5a4-3'
    ];

    this.getSensorsData('9786c9c4c95840228ed4fdb30bf9e5a4',sensorIds, minTime, currentTime, '15m', 'temperature');

    this.chartDataUpdateInterval = setInterval(() => this.getSensorsData('9786c9c4c95840228ed4fdb30bf9e5a4', 
                                    sensorIds, 
                                    minTime, 
                                    currentTime, 
                                    '15m', 
                                    'temperature'), 15 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.chartDataUpdateInterval);
  }

  getSensorsData(gwId, sensorIds, startTime, endTime, interval = '0m', type) {
    const query = {
      embed: 'sensors',
      'sensors[embed]': ['series', 'status', 'owner'],
      'sensors[series][dataStart]': (new Date(startTime)).toISOString(),
      'sensors[series][dataEnd]': (new Date(endTime)).toISOString(),
      'sensors[series][interval]': interval
    };

    if (!_.isEmpty(sensorIds)) {
      query['sensors[filter][id]'] = sensorIds
    }

    if (type) {
      query['sensors[filter][type]'] = type;
    }

    //sensorService.getSensorsData(gwId, query);
    this.props.onInitialChartData(gwId, query);
  }

  render() {
    const { classes } = this.props;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return <div className='m_db'>
      <div className="m_np_app_bar">
        <AppBarMobile />
      </div>
      <div className='m_db_header'>
        <Grid container spacing={0} className={classes.root}>
          <Grid item xs={4} className={classes.m_db_title}>
            <CurrentMomentMobile />
          </Grid>
          <Grid item xs={4} className={classes.m_db_title}>
            <CurrentWeatherMobile />
          </Grid>
          <Grid item xs={4} className={classes.m_db_title}>
            <CurrentLocationMobile />
          </Grid>
        </Grid>
      </div>
      <div className='db_slider'>
        <Slider {...settings}>
          <CardMobile type={SOURCE} titleName='태양광 발전량' titleImage={energy} description='현재 발전 전력' data={this.props.energyInfo} />
          <CardMobile type={BATTERY_1} titleName='ESS충전량' titleImage={battery1} description='현재 ESS 방전 전력' data={this.props.batteryInfo} />
          <CardMobile type={BATTERY_2} titleName='ESS방전량' titleImage={battery2} data={this.props.batteryInfo} />
          <CardMobile type={ELECTRICITY} titleName='계통 송수전 전력량' titleImage={electricity} description='현재 계통 송수전 전력' data={this.props.electricityInfo} />
        </Slider>
      </div>

      <div className='m_db_chart'>
          <LineChartCrs />
      </div>
    </div>
  }
}

const mapStateToProps = state => ({
  energyInfo: state.solarEnergy,
  electricityInfo: state.generatedElectricity,
  batteryInfo: state.batteryStorage
});

const mapDispatchToProps = dispatch => ({
  onUpdateBatteryInfo: () => dispatch(updateESSDischarge({
    thisMonth: (Math.random() * 1000).toFixed(1),
    today: (Math.random() * 100).toFixed(1),
    batteryRate: Math.round(Math.random() * 100)
  })),
  onInitialChartData: (gwId, params) => dispatch(getInitialDataForChart(gwId, params)),
  onFetchingCurrentUser: () => dispatch(getUsersMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardMobile));