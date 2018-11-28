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
import LineChart from '../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';
import { connect } from 'react-redux';

import { 
  getUsersMe, 
  getInitialDataForChart, 
  updateChartData, 
  updateDateTime, 
  updateWeather, 
  updateSolarEnergy,
  updateGridEnergy, 
  updateESSDischarge,
  updateESSCharge,
  updateESSStatus
} from '../../store/actionCreators';

import { SOURCE, BATTERY_1, BATTERY_2, ELECTRICITY } from '../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import socket from '../../services/wsServices';
import sensorService from '../../services/sensorService'
import _ from 'lodash';
import sensorInfo from './sensorsInfo';

//const LineChart = lazy(() => import('../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs'));

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

    this.initAndSubscribeChartData();
    
    this.initAndSubscribeWeatherData();
    this.initAndSubscribeSolarData();
    this.initAndSubscribeGridEnergyData();
    this.initAndSubscribeDischargeESSData();
    this.initAndSubscribeChargeESSData();
  }

  initAndSubscribeChartData() {
    const currentTime = new Date();
    const minTime = currentTime - 24 * 60 * 60 * 1000;

    const sensorIds = [
      sensorInfo.solargenPower,
      sensorInfo.eSSChargePower,
      sensorInfo.gridPower
    ];

    this.getSensorsData(sensorInfo.gwId, sensorIds, minTime, currentTime, '5m');

    const sensorsSubscriber = socket.newSensorSubscriber((data, info) => this.props.onUpdateChartData({
      id: info.id,
      owner: info.owner,
      time: data.time,
      value: data.value
    }));

    const sensors = _.map(sensorIds, sensorId => ({
      id: sensorId,
      owner: sensorInfo.gwId
    }));
    
    _.forEach(sensors, sensor => sensorsSubscriber.subscribe(sensor));
  }

  initAndSubscribeSolarData() {
    //subscribe sensors for ws
    const monthlySolarGenEnergy = {
      id: sensorInfo.monthlySolarGenEnergy,
      owner: sensorInfo.gwId
    };
    socket.newSensorSubscriber(data => this.props.onUpdateSolarEnergy({thisMonth: +(+data.value/1000).toFixed(1)})).subscribe(monthlySolarGenEnergy);

    const dailySolarGenEnergy = {
      id: sensorInfo.dailySolarGenEnergy,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateSolarEnergy({today: parseInt(data.value)})).subscribe(dailySolarGenEnergy);
    
    const solargenPower = {
      id: sensorInfo.solargenPower,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateSolarEnergy({curPower: data.value})).subscribe(solargenPower);
    
    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlySolarGenEnergy, query).then(res => this.props.onUpdateSolarEnergy({thisMonth: +(+_.get(res.data, 'data.series.value', '')/1000).toFixed(1)}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailySolarGenEnergy, query).then(res => this.props.onUpdateSolarEnergy({today: parseInt(_.get(res.data, 'data.series.value', ''))}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.solarInstallationCapacity, query).then(res => this.props.onUpdateSolarEnergy({capacity: +_.get(res.data, 'data.series.value', '')}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.solargenPower, query).then(res => this.props.onUpdateSolarEnergy({curPower: _.get(res.data, 'data.series.value', '')}));
  }

  initAndSubscribeGridEnergyData() {
    //subscribe sensors for ws
    const monthlyGridEnergy = {
      id: sensorInfo.monthlyGridEnergy,
      owner: sensorInfo.gwId
    };
    socket.newSensorSubscriber(data => this.props.onUpdateGridEnergy({thisMonth: +(+data.value/1000).toFixed(1)})).subscribe(monthlyGridEnergy);

    const dailyGridEnergy = {
      id: sensorInfo.dailyGridEnergy,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateGridEnergy({today: parseInt(data.value)})).subscribe(dailyGridEnergy);
    
    const gridPower = {
      id: sensorInfo.gridPower,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateGridEnergy({curPower: data.value})).subscribe(gridPower);
    

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlyGridEnergy, query).then(res => this.props.onUpdateGridEnergy({thisMonth: +(+_.get(res.data, 'data.series.value', '')/1000).toFixed(1)}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailyGridEnergy, query).then(res => this.props.onUpdateGridEnergy({today: parseInt(_.get(res.data, 'data.series.value', ''))}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.gridInstallationCapacity, query).then(res => this.props.onUpdateGridEnergy({capacity: +_.get(res.data, 'data.series.value', '')}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.gridPower, query).then(res => this.props.onUpdateGridEnergy({curPower: _.get(res.data, 'data.series.value', '')}));
  }

  initAndSubscribeDischargeESSData() {
    //subscribe sensors for ws
    const monthlyESSDischargeEnergy = {
      id: sensorInfo.monthlyESSDischargeEnergy,
      owner: sensorInfo.gwId
    };
    socket.newSensorSubscriber(data => this.props.onUpdateESSDischarge({thisMonth: +(+data.value/1000).toFixed(1)})).subscribe(monthlyESSDischargeEnergy);

    const dailyESSDischargeEnergy = {
      id: sensorInfo.dailyESSDischargeEnergy,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateESSDischarge({today: parseInt(data.value)})).subscribe(dailyESSDischargeEnergy);
    
    const batteryRate = {
      id: sensorInfo.batteryRate,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateESSDischarge({batteryRate: +data.value})).subscribe(batteryRate);
    
    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({thisMonth: +(+_.get(res.data, 'data.series.value', '')/1000).toFixed(1)}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({today: parseInt(_.get(res.data, 'data.series.value', ''))}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.batteryRate, query).then(res => this.props.onUpdateESSDischarge({batteryRate: +_.get(res.data, 'data.series.value', '')}));
  }

  initAndSubscribeChargeESSData() {
    //subscribe sensors for ws
    const monthlyESSChargeEnergy = {
      id: sensorInfo.monthlyESSChargeEnergy,
      owner: sensorInfo.gwId
    };
    socket.newSensorSubscriber(data => this.props.onUpdateESSCharge({thisMonth: +(+data.value/1000).toFixed(1)})).subscribe(monthlyESSChargeEnergy);

    const dailyESSChargeEnergy = {
      id: sensorInfo.dailyESSChargeEnergy,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateESSCharge({today: data.value})).subscribe(dailyESSChargeEnergy);
    
    const eSSChargePower = {
      id: sensorInfo.eSSChargePower,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => {
      const curPower = data.value;
      this.props.onUpdateESSCharge({curPower: curPower});
      this.props.onUpdateESSStatus(+curPower >= 0);
    }).subscribe(eSSChargePower);
    
    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlyESSChargeEnergy, query).then(res => this.props.onUpdateESSCharge({thisMonth: +(+_.get(res.data, 'data.series.value', '')/1000).toFixed(1)}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailyESSChargeEnergy, query).then(res => this.props.onUpdateESSCharge({today: +_.get(res.data, 'data.series.value', '')}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.ESSInstallationCapacity, query).then(res => this.props.onUpdateESSCharge({capacity: +_.get(res.data, 'data.series.value', '')}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.eSSChargePower, query).then(res => {
      const curPower = _.get(res.data, 'data.series.value', '');
      this.props.onUpdateESSCharge({curPower: curPower});
      this.props.onUpdateESSStatus(+curPower >= 0);
    });      
  }

  initAndSubscribeWeatherData(){
    //subscribe sensors for ws
    const tempSensor = {
      id: sensorInfo.temperature,
      owner: sensorInfo.gwId
    };
    socket.newSensorSubscriber(data => this.props.onUpdateWeather({temperature: data.value})).subscribe(tempSensor);

    const humiditySensor = {
      id: sensorInfo.humidity,
      owner: sensorInfo.gwId
    }
    socket.newSensorSubscriber(data => this.props.onUpdateWeather({humidity: data.value})).subscribe(humiditySensor);
    
    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.temperature, query).then(res => this.props.onUpdateWeather({temperature: +_.get(res.data, 'data.series.value', '')}));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.humidity, query).then(res => this.props.onUpdateWeather({humidity: +_.get(res.data, 'data.series.value', '')}));
  }

  getSensorData(gwId, sensorIds){
    const query = {
      embed: 'sensors',
      'sensors[embed]': ['series', 'status', 'owner'],
    };

    if (!_.isEmpty(sensorIds)) {
      query['sensors[filter][id]'] = sensorIds
    }

    sensorService.getSensorsData(gwId, query).then(res => console.log(_.filter(_.get(res.data, 'data.sensors'), sensor => _.isObject(sensor)).map(sensor => _.get(sensor, 'series.value'))));
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
            description='현재 발전 전력' data={this.props.solarEnergy} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <Card type={BATTERY_1} titleName='ESS충전량' titleImage={battery1}
                description={this.props.isESSCharging ? '현재 ESS 충전 전력' : '현재 ESS 방전 전력'} data={this.props.ESSCharge} isActive={this.props.isESSCharging}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card type={BATTERY_2} titleName='ESS방전량' titleImage={battery2} data={this.props.ESSDischarge} isActive={!this.props.isESSCharging}/>
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
  solarEnergy: state.solarEnergy,
  electricityInfo: state.generatedElectricity,
  ESSDischarge: state.ESSDischarge,
  ESSCharge: state.ESSCharge,
  isESSCharging: state.isESSCharging, 
});

const mapDispatchToProps = dispatch => ({
  onUpdateWeather: ({temperature, humidity}) => dispatch(updateWeather({temperature, humidity})),
  onUpdateDateTime: ([date, time]) => date && time && dispatch(updateDateTime({date, time})),
  onFetchingCurrentUser: () => dispatch(getUsersMe()),
  onInitialChartData: (gwId, params) => dispatch(getInitialDataForChart(gwId, params)),
  onUpdateChartData: data => dispatch(updateChartData(data)),
  onUpdateSolarEnergy: data => dispatch(updateSolarEnergy(data)),
  onUpdateGridEnergy: data => dispatch(updateGridEnergy(data)),
  onUpdateESSDischarge: data => dispatch(updateESSDischarge(data)),
  onUpdateESSCharge: data => dispatch(updateESSCharge(data)),
  onUpdateESSStatus: data => dispatch(updateESSStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));