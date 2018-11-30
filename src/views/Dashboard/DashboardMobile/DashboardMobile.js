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
import sensorInfo from '../sensorsInfo';
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

    this.initAndSubscribeChartData();

    this.initAndSubscribeWeatherData();
    this.initAndSubscribeSolarData();
    this.initAndSubscribeGridEnergyData();
    this.initAndSubscribeDischargeESSData();
    this.initAndSubscribeChargeESSData();
    this.initAndSubscribeBatteryStatus();
  }

  initAndSubscribeBatteryStatus() {
    //subscribe sensors for ws
    const manualStatus = {
      id: sensorInfo.manualStatus,
      owner: sensorInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensors(manualStatus, data => this.props.onUpdateBatteryStatus(+data.value ? MANUAL : ABNORMAL)));

    const automaticStatus = {
      id: sensorInfo.automaticStatus,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(automaticStatus, data => this.props.onUpdateBatteryStatus(+data.value ? AUTOMATIC : ABNORMAL)));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.manualStatus, query).then(res => this.props.onUpdateBatteryStatus(+_.get(res.data, 'data.series.value', '') ? MANUAL : ABNORMAL));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.automaticStatus, query).then(res => this.props.onUpdateBatteryStatus(+_.get(res.data, 'data.series.value', '') ? AUTOMATIC : ABNORMAL));
  }

  initAndSubscribeChartData() {
    const currentTime = new Date();
    const minTime = currentTime - 24 * 60 * 60 * 1000;

    const sensorIds = [
      sensorInfo.solargenPower,
      sensorInfo.eSSChargePower,
      sensorInfo.gridPower
    ];

    this.getSensorsData(sensorInfo.gwId, sensorIds, minTime, currentTime, '15m');

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

    this.wsSubscribers.push(sensorsSubscriber);
  }

  initAndSubscribeSolarData() {
    //subscribe sensors for ws
    const monthlySolarGenEnergy = {
      id: sensorInfo.monthlySolarGenEnergy,
      owner: sensorInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensors(monthlySolarGenEnergy, data => this.props.onUpdateSolarEnergy({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailySolarGenEnergy = {
      id: sensorInfo.dailySolarGenEnergy,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(dailySolarGenEnergy, data => this.props.onUpdateSolarEnergy({ today: parseInt(data.value) })));

    const solargenPower = {
      id: sensorInfo.solargenPower,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(solargenPower, data => this.props.onUpdateSolarEnergy({ curPower: (+data.value).toFixed(1) })));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlySolarGenEnergy, query).then(res => this.props.onUpdateSolarEnergy({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailySolarGenEnergy, query).then(res => this.props.onUpdateSolarEnergy({ today: parseInt(_.get(res.data, 'data.series.value', '')) }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.solarInstallationCapacity, query).then(res => this.props.onUpdateSolarEnergy({ capacity: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.solargenPower, query).then(res => this.props.onUpdateSolarEnergy({ curPower: _.get(res.data, 'data.series.value', '') }));
  }

  initAndSubscribeGridEnergyData() {
    //subscribe sensors for ws
    const monthlyGridEnergy = {
      id: sensorInfo.monthlyGridEnergy,
      owner: sensorInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensors(monthlyGridEnergy, data => this.props.onUpdateGridEnergy({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailyGridEnergy = {
      id: sensorInfo.dailyGridEnergy,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(dailyGridEnergy, data => this.props.onUpdateGridEnergy({ today: parseInt(data.value) })));

    const gridPower = {
      id: sensorInfo.gridPower,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(gridPower, data => this.props.onUpdateGridEnergy({ curPower: (+data.value).toFixed(1) })));


    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlyGridEnergy, query).then(res => this.props.onUpdateGridEnergy({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailyGridEnergy, query).then(res => this.props.onUpdateGridEnergy({ today: parseInt(_.get(res.data, 'data.series.value', '')) }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.gridInstallationCapacity, query).then(res => this.props.onUpdateGridEnergy({ capacity: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.gridPower, query).then(res => this.props.onUpdateGridEnergy({ curPower: _.get(res.data, 'data.series.value', '') }));
  }

  initAndSubscribeDischargeESSData() {
    //subscribe sensors for ws
    const monthlyESSDischargeEnergy = {
      id: sensorInfo.monthlyESSDischargeEnergy,
      owner: sensorInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensors(monthlyESSDischargeEnergy, data => this.props.onUpdateESSDischarge({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailyESSDischargeEnergy = {
      id: sensorInfo.dailyESSDischargeEnergy,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(dailyESSDischargeEnergy, data => this.props.onUpdateESSDischarge({ today: parseInt(data.value) })));

    const batteryRate = {
      id: sensorInfo.batteryRate,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(batteryRate, data => this.props.onUpdateESSDischarge({ batteryRate: +data.value })));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({ today: parseInt(_.get(res.data, 'data.series.value', '')) }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.batteryRate, query).then(res => this.props.onUpdateESSDischarge({ batteryRate: +_.get(res.data, 'data.series.value', '') }));
  }

  initAndSubscribeChargeESSData() {
    //subscribe sensors for ws
    const monthlyESSChargeEnergy = {
      id: sensorInfo.monthlyESSChargeEnergy,
      owner: sensorInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensors(monthlyESSChargeEnergy, data => this.props.onUpdateESSCharge({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailyESSChargeEnergy = {
      id: sensorInfo.dailyESSChargeEnergy,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(dailyESSChargeEnergy, data => this.props.onUpdateESSCharge({ today: data.value })));

    const eSSChargePower = {
      id: sensorInfo.eSSChargePower,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(eSSChargePower, data => {
      const curPower = data.value;
      this.props.onUpdateESSCharge({ curPower: (+curPower).toFixed(1) });
      this.props.onUpdateESSStatus(+curPower < 0);
    }));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.monthlyESSChargeEnergy, query).then(res => this.props.onUpdateESSCharge({ thisMonth: +(+_.get(res.data, 'data.series.value', '') / 1000).toFixed(1) }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.dailyESSChargeEnergy, query).then(res => this.props.onUpdateESSCharge({ today: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.ESSInstallationCapacity, query).then(res => this.props.onUpdateESSCharge({ capacity: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.eSSChargePower, query).then(res => {
      const curPower = _.get(res.data, 'data.series.value', '');
      this.props.onUpdateESSCharge({ curPower: curPower });
      this.props.onUpdateESSStatus(+curPower < 0);
    });
  }

  initAndSubscribeWeatherData() {
    //subscribe sensors for ws
    const tempSensor = {
      id: sensorInfo.temperature,
      owner: sensorInfo.gwId
    };
    this.wsSubscribers.push(socket.subscribeSensors(tempSensor, data => this.props.onUpdateWeather({ temperature: data.value })));

    const humiditySensor = {
      id: sensorInfo.humidity,
      owner: sensorInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensors(humiditySensor, data => this.props.onUpdateWeather({ humidity: data.value })));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.temperature, query).then(res => this.props.onUpdateWeather({ temperature: +_.get(res.data, 'data.series.value', '') }));
    sensorService.getSensorData(sensorInfo.gwId, sensorInfo.humidity, query).then(res => this.props.onUpdateWeather({ humidity: +_.get(res.data, 'data.series.value', '') }));
  }

  getSensorData(gwId, sensorIds) {
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
  onInitialChartData: (gwId, params) => dispatch(getInitialDataForChart(gwId, params)),
  onUpdateChartData: data => dispatch(updateChartData(data)),
  onUpdateSolarEnergy: data => dispatch(updateSolarEnergy(data)),
  onUpdateGridEnergy: data => dispatch(updateGridEnergy(data)),
  onUpdateESSDischarge: data => dispatch(updateESSDischarge(data)),
  onUpdateESSCharge: data => dispatch(updateESSCharge(data)),
  onUpdateESSStatus: data => dispatch(updateESSStatus(data)),
  onUpdateBatteryStatus: data => dispatch(updateBatteryStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardMobile));