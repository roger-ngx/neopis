import React, { lazy, Suspense } from 'react';
import './Dashboard.scss';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from '@material-ui/core/Grid';
import Card from './Card/Card';
import battery1 from '../../assets/images/battery-1.svg';
import battery2 from '../../assets/images/battery-2.svg';
import electricity from '../../assets/images/electricity.svg';
import energy from '../../assets/images/energy.svg';
import AppBar from '../../components/AppBar/AppBar';
// import LineChart from '../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';
import { connect } from 'react-redux';
import { updateBatteryInfor, getUsersMe } from '../../store/actionCreators';
import { SOURCE, BATTERY_1, BATTERY_2, ELECTRICITY } from '../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import socket from '../../services/wsServices';
import sensorService from '../../services/sensorService'
import _ from 'lodash';

const LineChart = lazy(() => import('../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs'));

const styles = {
  root: {
    flexGrow: 1,
    'margin-top': '30px'
  },
  db_card_title: {
    'max-width': '300px',
    'min-height': '50px'
  },
  db_nav_weather: {
    'max-width': '150px',
    'min-height': '50px'
  },
  db_nav_location: {
    'max-width': '250px',
    'min-height': '50px'
  }
}

class Dashboard extends React.Component {

  componentDidMount() {
    this.props.onFetchingCurrentUser();

    socket.initSocketChannel();

    let sensor = {
      id: 'temperature-0b842e22550d4919b8465b0f8c14acf1-2',
      owner: '0b842e22550d4919b8465b0f8c14acf1'
    }
    socket.subscribeSensor(sensor, data => console.log(data), data => console.log(data));

    const currentTime = new Date();
    const minTime = currentTime - 24 * 60 * 60 * 1000;

    var query = {
      embed: ['owner', 'series'],
      'series[dataStart]': (new Date(minTime)).toISOString(),
      'series[dataEnd]': (new Date(currentTime)).toISOString(),
      'series[interval]': '5m'
    };

    sensorService.getSensorData('0b842e22550d4919b8465b0f8c14acf1', 
    'temperature-0b842e22550d4919b8465b0f8c14acf1-2',
    query);

    this.getSensorsData('0b842e22550d4919b8465b0f8c14acf1', null, minTime, currentTime, '10m', 'temperature');
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

    sensorService.getSensorsData(gwId, query);
  }

  componentWillUnmount() {
    socket.disconnectSocketChannel();
  }

  render() {
    const { classes } = this.props;
    return <div className="np_dashboard">
      <div className="np_app_bar" onClick={this.props.onUpdateBatteryInfo}>
        <AppBar />
      </div>
      <Grid container className={classes.root} spacing={8}>
        <Grid item xs={12} md={3}>
          <Card type={SOURCE} titleName='태양광 발전량' titleImage={energy}
            description='현재 발전 전력' data={this.props.energyInfo} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <Card type={BATTERY_1} titleName='ESS충전량' titleImage={battery1}
                description='현재 ESS 방전 전력' data={this.props.batteryInfo} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card type={BATTERY_2} titleName='ESS방전량' titleImage={battery2} data={this.props.batteryInfo} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card type={ELECTRICITY} titleName='계통 송수전 전력량' titleImage={electricity}
            description='현재 계통 송수전 전력' data={this.props.electricityInfo} />
        </Grid>
      </Grid>
      <Grid container className='db_chart'>
        <Suspense fallback={<div className='db_chart_loading'>Loading...</div>}>
          <Grid item xs={12}>
            <LineChart />
          </Grid>
        </Suspense>
      </Grid>
    </div>
  }
}

const mapStateToProps = state => ({
  energyInfo: state.solarEnergy,
  electricityInfo: state.generatedElectricity,
  batteryInfo: state.batteryStorage
});

const mapDispatchToProps = dispatch => ({
  onUpdateBatteryInfo: () => {
    dispatch(updateBatteryInfor({
      thisMonth: (Math.random() * 1000).toFixed(1),
      today: (Math.random() * 100).toFixed(1),
      percentage: Math.round(Math.random() * 100)
    }))
  },
  onFetchingCurrentUser: () => dispatch(getUsersMe())
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));