import React from 'react';
import './DashboardMobile.scss';
import withStyles from "@material-ui/core/styles/withStyles";
import CurrentMomentMobile from '../../../components/CurrentMoment/mobile/CurrentMomentMobile';
import CurrentWeatherMobile from '../../../components/CurrentWeather/mobile/CurrentWeatherMobile';
import CurrentLocationMobile from '../../../components/CurrentLocation/mobile/CurrentLocationMobile';
import Grid from '@material-ui/core/Grid';
import CardMobile from '../../../components/Card/mobile/CardMobile';
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
  updateESSStatus,
  updateBatteryStatus
} from '../../../store/actionCreators';
import LineChartCrs from '../../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';
import _ from 'lodash';
import socket from '../../../services/wsServices';
import sensorService from '../../../services/sensorService'
import { ABNORMAL, MANUAL, AUTOMATIC } from '../../../components/BatteryMode/BatteryMode';

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

  constructor(props) {
    super(props);
    this.wsSubscribers = [];
  }

  componentDidMount() {
    this.props.onFetchingCurrentUser();
    socket.initSocketChannel();

    sensorService.getGatewayInfo().then(res => {
      this.gatewayInfo = _.pick(_.get(res.data, ['data', '0']), ['name', 'gwId', 'sensors']);

      this.initAndSubscribeChartData();
      this.initAndSubscribeWeatherData();
      this.initAndSubscribeSolarData();
      this.initAndSubscribeGridEnergyData();
      this.initAndSubscribeDischargeESSData();
      this.initAndSubscribeChargeESSData();
      this.initAndSubscribeBatteryStatus();
    });
  }

  initAndSubscribeBatteryStatus() {
    //subscribe sensors for ws
    const manualStatus = {
      id: this.gatewayInfo.sensors.manualStatus,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(manualStatus, data => this.props.onUpdateBatteryStatus(+data.value ? MANUAL : ABNORMAL)));

    const automaticStatus = {
      id: this.gatewayInfo.sensors.automaticStatus,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(automaticStatus, data => this.props.onUpdateBatteryStatus(+data.value ? AUTOMATIC : ABNORMAL)));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.manualStatus, query).then(res => this.props.onUpdateBatteryStatus(+_.get(res.data, 'data.series.value', '') ? MANUAL : ABNORMAL));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.automaticStatus, query).then(res => this.props.onUpdateBatteryStatus(+_.get(res.data, 'data.series.value', '') ? AUTOMATIC : ABNORMAL));
  }

  initAndSubscribeChartData() {
    const currentTime = new Date();
    const minTime = currentTime - 24 * 60 * 60 * 1000;

    const sensorIds = [
      this.gatewayInfo.sensors.solargenPower,
      this.gatewayInfo.sensors.eSSChargePower,
      this.gatewayInfo.sensors.gridPower
    ];

    this.getSensorsData(this.gatewayInfo.gwId, sensorIds, minTime, currentTime, '15m');

    const sensorsSubscriber = socket.newSensorSubscriber((data, info) => this.props.onUpdateChartData({
      id: info.id,
      owner: info.owner,
      time: data.time,
      value: data.value
    }));

    const sensors = _.map(sensorIds, sensorId => ({
      id: sensorId,
      owner: this.gatewayInfo.gwId
    }));

    _.forEach(sensors, sensor => sensorsSubscriber.subscribe(sensor));

    this.wsSubscribers.push(sensorsSubscriber);
  }

  initAndSubscribeSolarData() {
    //subscribe sensors for ws
    const monthlySolarGenEnergy = {
      id: this.gatewayInfo.sensors.monthlySolarGenEnergy,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(monthlySolarGenEnergy, data => this.props.onUpdateSolarEnergy({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailySolarGenEnergy = {
      id: this.gatewayInfo.sensors.dailySolarGenEnergy,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(dailySolarGenEnergy, data => this.props.onUpdateSolarEnergy({ today: parseInt(data.value) })));

    const solargenPower = {
      id: this.gatewayInfo.sensors.solargenPower,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(solargenPower, data => this.props.onUpdateSolarEnergy({ curPower: (+data.value).toFixed(1) })));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlySolarGenEnergy, query).then(res => this.props.onUpdateSolarEnergy({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailySolarGenEnergy, query).then(res => this.props.onUpdateSolarEnergy({ today: parseInt(_.get(res.data, 'data.series.value', '')) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.solarInstallationCapacity, query).then(res => this.props.onUpdateSolarEnergy({ capacity: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.solargenPower, query).then(res => this.props.onUpdateSolarEnergy({ curPower: _.get(res.data, 'data.series.value', '') }));
  }

  initAndSubscribeGridEnergyData() {
    //subscribe sensors for ws
    const monthlyGridEnergy = {
      id: this.gatewayInfo.sensors.monthlyGridEnergy,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(monthlyGridEnergy, data => this.props.onUpdateGridEnergy({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailyGridEnergy = {
      id: this.gatewayInfo.sensors.dailyGridEnergy,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(dailyGridEnergy, data => this.props.onUpdateGridEnergy({ today: parseInt(data.value) })));

    const gridPower = {
      id: this.gatewayInfo.sensors.gridPower,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(gridPower, data => this.props.onUpdateGridEnergy({ curPower: (+data.value).toFixed(1) })));


    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlyGridEnergy, query).then(res => this.props.onUpdateGridEnergy({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailyGridEnergy, query).then(res => this.props.onUpdateGridEnergy({ today: parseInt(_.get(res.data, 'data.series.value', '')) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.gridInstallationCapacity, query).then(res => this.props.onUpdateGridEnergy({ capacity: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.gridPower, query).then(res => this.props.onUpdateGridEnergy({ curPower: _.get(res.data, 'data.series.value', '') }));
  }

  initAndSubscribeDischargeESSData() {
    //subscribe sensors for ws
    const monthlyESSDischargeEnergy = {
      id: this.gatewayInfo.sensors.monthlyESSDischargeEnergy,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(monthlyESSDischargeEnergy, data => this.props.onUpdateESSDischarge({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailyESSDischargeEnergy = {
      id: this.gatewayInfo.sensors.dailyESSDischargeEnergy,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(dailyESSDischargeEnergy, data => this.props.onUpdateESSDischarge({ today: parseInt(data.value) })));

    const batteryRate = {
      id: this.gatewayInfo.sensors.batteryRate,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(batteryRate, data => this.props.onUpdateESSDischarge({ batteryRate: +data.value })));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({ today: parseInt(_.get(res.data, 'data.series.value', '')) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.batteryRate, query).then(res => this.props.onUpdateESSDischarge({ batteryRate: +_.get(res.data, 'data.series.value', '') }));
  }

  initAndSubscribeChargeESSData() {
    //subscribe sensors for ws
    const monthlyESSChargeEnergy = {
      id: this.gatewayInfo.sensors.monthlyESSChargeEnergy,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(monthlyESSChargeEnergy, data => this.props.onUpdateESSCharge({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailyESSChargeEnergy = {
      id: this.gatewayInfo.sensors.dailyESSChargeEnergy,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(dailyESSChargeEnergy, data => this.props.onUpdateESSCharge({ today: data.value })));

    const eSSChargePower = {
      id: this.gatewayInfo.sensors.eSSChargePower,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(eSSChargePower, data => {
      const curPower = data.value;
      this.props.onUpdateESSCharge({ curPower: (+curPower).toFixed(1) });
      this.props.onUpdateESSStatus(+curPower < 0);
    }));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlyESSChargeEnergy, query).then(res => this.props.onUpdateESSCharge({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailyESSChargeEnergy, query).then(res => this.props.onUpdateESSCharge({ today: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.ESSInstallationCapacity, query).then(res => this.props.onUpdateESSCharge({ capacity: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.eSSChargePower, query).then(res => {
      const curPower = _.get(res.data, 'data.series.value', '');
      this.props.onUpdateESSCharge({ curPower: curPower });
      this.props.onUpdateESSStatus(+curPower < 0);
    });
  }

  initAndSubscribeWeatherData() {
    //subscribe sensors for ws
    const tempSensor = {
      id: this.gatewayInfo.sensors.temperature,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(tempSensor, data => this.props.onUpdateWeather({ temperature: data.value })));

    const humiditySensor = {
      id: this.gatewayInfo.sensors.humidity,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(humiditySensor, data => this.props.onUpdateWeather({ humidity: data.value })));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.temperature, query).then(res => this.props.onUpdateWeather({ temperature: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.humidity, query).then(res => this.props.onUpdateWeather({ humidity: +_.get(res.data, 'data.series.value', '') }));
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

    const sortedSensorIds = [
      this.gatewayInfo.sensors.solargenPower,
      this.gatewayInfo.sensors.eSSChargePower,
      this.gatewayInfo.sensors.gridPower
    ];

    this.props.onInitialChartData(gwId, query, sortedSensorIds);
  }

  componentWillUnmount() {
    _.forEach(this.wsSubscribers, unsubscriber => unsubscriber());

    socket.disconnectSocketChannel();
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
          <CardMobile type={SOURCE} titleName='태양광 발전량' 
                      titleImage={energy} description='현재 발전 전력' 
                      data={this.props.solarEnergy} />

          <CardMobile type={BATTERY_1} titleName='ESS충전량' 
                      titleImage={battery1} description='현재 ESS 방전 전력' 
                      data={this.props.ESSCharge} 
                      isActive={this.props.isESSCharging}/>
          
          <CardMobile type={BATTERY_2} titleName='ESS방전량' 
                      titleImage={battery2} data={this.props.ESSDischarge} 
                      isActive={!this.props.isESSCharging} 
                      batteryStatus={this.props.batteryStatus}/>
          
          <CardMobile type={ELECTRICITY} titleName='계통 송수전 전력량' 
                      titleImage={electricity} description='현재 계통 송수전 전력' 
                      data={this.props.electricityInfo} />
        </Slider>
      </div>

      <div className='m_db_chart'>
        <LineChartCrs />
      </div>
    </div>
  }
}

const mapStateToProps = state => ({
  solarEnergy: state.solarEnergy,
  electricityInfo: state.generatedElectricity,
  ESSDischarge: state.ESSDischarge,
  ESSCharge: state.ESSCharge,
  isESSCharging: state.isESSCharging,
  batteryStatus: state.batteryStatus
});

const mapDispatchToProps = dispatch => ({
  onUpdateWeather: ({ temperature, humidity }) => dispatch(updateWeather({ temperature, humidity })),
  onUpdateDateTime: ([date, time]) => date && time && dispatch(updateDateTime({ date, time })),
  onFetchingCurrentUser: () => dispatch(getUsersMe()),
  onInitialChartData: (gwId, params, sensorIds) => dispatch(getInitialDataForChart(gwId, params, sensorIds)),
  onUpdateChartData: data => dispatch(updateChartData(data)),
  onUpdateSolarEnergy: data => dispatch(updateSolarEnergy(data)),
  onUpdateGridEnergy: data => dispatch(updateGridEnergy(data)),
  onUpdateESSDischarge: data => dispatch(updateESSDischarge(data)),
  onUpdateESSCharge: data => dispatch(updateESSCharge(data)),
  onUpdateESSStatus: data => dispatch(updateESSStatus(data)),
  onUpdateBatteryStatus: data => dispatch(updateBatteryStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardMobile));