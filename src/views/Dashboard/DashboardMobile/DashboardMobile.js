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
  initialChartData,
  updateChartData,
  updateDateTime,
  updateWeather,
  updateLocation,
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
import { MANUAL, AUTOMATIC } from '../../../components/BatteryMode/BatteryMode';

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

const SERIES_DATA_PATH = 'data.series.value';
class DashboardMobile extends React.Component {

  constructor(props) {
    super(props);
    this.wsSubscribers = [];
  }

  componentDidMount() {
    this.props.onFetchingCurrentUser();
    socket.initSocketChannel();

    this.init().catch(() => window.location = '/#/login');
  }

  async init() {
    const gwInfo = await sensorService.getGatewayInfo();

    this.gatewayInfo = _.pick(_.get(gwInfo.data, ['data', '0']), ['name', 'gwId', 'meta', 'sensors']);

    if (!_.isEmpty(this.gatewayInfo)) {
      this.initChartData();
      this.initAndSubscribeWeatherData();
      this.initAndSubscribeSolarData();
      this.initAndSubscribeGridEnergyData();
      this.initAndSubscribeDischargeESSData();
      this.initAndSubscribeChargeESSData();
      this.initAndSubscribeBatteryStatus();
    }
  }

  getSensorValues(gwId, sensorIds) {
    const query = {
      embed: 'sensors',
      'sensors[embed]': 'series',
      'sensors[filter][id]': sensorIds
    };

    return sensorService.getSensorsData(gwId, query);
  }

  initAndSubscribeBatteryStatus() {
    //subscribe sensors for ws
    const manualStatus = {
      id: this.gatewayInfo.sensors.manualStatus,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(
      socket.subscribeSensor(manualStatus,
        data => +data.value && this.props.onUpdateBatteryStatus(MANUAL))
    );

    const automaticStatus = {
      id: this.gatewayInfo.sensors.automaticStatus,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(
      socket.subscribeSensor(automaticStatus,
        data => +data.value && this.props.onUpdateBatteryStatus(AUTOMATIC))
    );

    //query for the 1st data

    this.getSensorValues(this.gatewayInfo.gwId,
      [
        this.gatewayInfo.sensors.manualStatus,
        this.gatewayInfo.sensors.automaticStatus
      ]).then(res => {
        const sensorData = _.filter(_.get(res, 'data.data.sensors'), data => _.isObject(data))
          .map(data => _.pick(data, ['name', 'id', 'series.value']));

        _.forEach(sensorData, data => {
          const value = +_.get(data, 'series.value', '');

          if (data.id === this.gatewayInfo.sensors.manualStatus) {
            value && this.props.onUpdateBatteryStatus(MANUAL);
          }

          if (data.id === this.gatewayInfo.sensors.automaticStatus) {
            value && this.props.onUpdateBatteryStatus(AUTOMATIC);
          }
        })
      });
  }

  initChartData() {
    const endTime = new Date();
    const startTime = endTime - 24 * 60 * 60 * 1000;

    const sensorIds = [
      this.gatewayInfo.sensors.solargenPower,
      this.gatewayInfo.sensors.eSSChargePower,
      this.gatewayInfo.sensors.gridPower
    ];

    this.getSensorSeries(this.gatewayInfo.gwId, sensorIds, startTime, endTime, '5m')
      .then(res => {
        this.processDataForChart(res.data, sensorIds, startTime, endTime);
        this.props.onUpdateLocation(_.get(res.data, 'data.location.address'));
      })
  }

  processDataForChart(data, sensorIds, startTime, endTime) {
    const sensorData = _.filter(_.get(data, 'data.sensors'), data => _.isObject(data))
      .map(data => _.pick(data, ['name', 'id', 'series.data']));

    const durationInMs = 5 * 60 * 1000;

    _.forEach(sensorData, data => {
      const seriesData = _.get(data, 'series.data', []);

      const length = seriesData.length;

      if (length) {
        const min = seriesData[1];
        const max = seriesData[length - 1];

        let index = 0;
        for (let time = min; time <= max; time += durationInMs) {
          if (seriesData[2 * index + 1] === time) {
            index++;
            continue;
          } else {
            seriesData.splice(2 * index, 0, null, time);
            index++;
          }
        }

        for (let time = min - durationInMs; time > startTime; time -= durationInMs) {
          seriesData.unshift(null, time);
        }

        for (let time = max + durationInMs; time <= endTime; time += durationInMs) {
          seriesData.push(null, time);
        }
      } else {
        for (let time = endTime; time > startTime; time -= durationInMs) {
          seriesData.unshift(null, time);
        }
      }
    });

    const sortedSensorData = [];

    _.forEach(sensorIds, sensorId => {
      const sensor = _.filter(sensorData, sensor => sensor.id === sensorId);
      sensor.length && sortedSensorData.push(sensor[0]);
    })

    this.props.onInitialChartData(sortedSensorData);
  }

  initAndSubscribeSolarData() {
    const sensors = this.gatewayInfo.sensors;
    const gwId = this.gatewayInfo.gwId;

    //subscribe sensors for ws
    const monthlySolarGenEnergy = {
      id: sensors.monthlySolarGenEnergy,
      owner: gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(monthlySolarGenEnergy,
      data => this.props.onUpdateSolarEnergy({ thisMonth: +(+data.value / 1000).toFixed(1) })));

    const dailySolarGenEnergy = {
      id: sensors.dailySolarGenEnergy,
      owner: gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(dailySolarGenEnergy,
      data => this.props.onUpdateSolarEnergy({ today: parseInt(data.value) })));

    const solargenPower = {
      id: sensors.solargenPower,
      owner: gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(solargenPower, (data, info) => {
      this.props.onUpdateSolarEnergy({ curPower: (+data.value).toFixed(1) });

      this.props.onUpdateChartData({
        id: info.id,
        owner: info.owner,
        time: data.time,
        value: data.value
      });
    }));

    //query for the 1st data
    this.getSensorValues(gwId,
      [
        sensors.monthlySolarGenEnergy,
        sensors.dailySolarGenEnergy,
        sensors.solarInstallationCapacity,
        sensors.solargenPower
      ]).then(res => {
        const sensorData = _.filter(_.get(res, 'data.data.sensors'), data => _.isObject(data))
          .map(data => _.pick(data, ['name', 'id', 'series.value']));

        _.forEach(sensorData, data => {
          if (data.id === sensors.monthlySolarGenEnergy) {
            this.props.onUpdateSolarEnergy({
              thisMonth: +(+_.get(data, 'series.value', '') / 1000).toFixed(1)
            });
            return;
          }

          if (data.id === sensors.dailySolarGenEnergy) {
            this.props.onUpdateSolarEnergy({
              today: parseInt(_.get(data, 'series.value', ''))
            });
            return;
          }

          if (data.id === sensors.solarInstallationCapacity) {
            this.props.onUpdateSolarEnergy({
              capacity: +_.get(data, 'series.value', '')
            });
            return;
          }

          if (data.id === sensors.solargenPower) {
            this.props.onUpdateSolarEnergy({
              curPower: (+_.get(data, 'series.value', '')).toFixed(1)
            });
            return;
          }
        })
      });
  }

  initAndSubscribeGridEnergyData() {
    //subscribe sensors for ws
    const monthlyGridEnergy = {
      id: this.gatewayInfo.sensors.monthlyGridEnergy,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(
      socket.subscribeSensor(monthlyGridEnergy,
        data => this.props.onUpdateGridEnergy({
          thisMonth: +(+data.value / 1000).toFixed(1)
        }))
    );

    const dailyGridEnergy = {
      id: this.gatewayInfo.sensors.dailyGridEnergy,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(
      socket.subscribeSensor(dailyGridEnergy,
        data => this.props.onUpdateGridEnergy({
          today: parseInt(data.value)
        }))
    );

    const gridPower = {
      id: this.gatewayInfo.sensors.gridPower,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(gridPower, (data, info) => {
      this.props.onUpdateGridEnergy({ curPower: (+data.value).toFixed(1) });

      this.props.onUpdateChartData({
        id: info.id,
        owner: info.owner,
        time: data.time,
        value: data.value
      });
    }));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlyGridEnergy, query)
      .then(res => this.props.onUpdateGridEnergy({
        thisMonth: +(+_.get(res.data, SERIES_DATA_PATH, '') / 1000).toFixed(1)
      }));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailyGridEnergy, query)
      .then(res => this.props.onUpdateGridEnergy({
        today: parseInt(_.get(res.data, SERIES_DATA_PATH, ''))
      }));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.gridInstallationCapacity, query)
      .then(res => this.props.onUpdateGridEnergy({
        capacity: +_.get(res.data, SERIES_DATA_PATH, '')
      }));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.gridPower, query)
      .then(res => this.props.onUpdateGridEnergy({
        curPower: (+_.get(res.data, SERIES_DATA_PATH, '')).toFixed(1)
      }));
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
    this.wsSubscribers.push(socket.subscribeSensor(batteryRate, data => this.props.onUpdateESSDischarge({ batteryRate: (+data.value).toFixed(1) })));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({ thisMonth: +(+_.get(res.data, SERIES_DATA_PATH, '') / 1000).toFixed(1) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailyESSDischargeEnergy, query).then(res => this.props.onUpdateESSDischarge({ today: parseInt(_.get(res.data, SERIES_DATA_PATH, '')) }));
    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.batteryRate, query).then(res => this.props.onUpdateESSDischarge({ batteryRate: parseInt(_.get(res.data, SERIES_DATA_PATH), '') }));
  }

  initAndSubscribeChargeESSData() {
    //subscribe sensors for ws
    const monthlyESSChargeEnergy = {
      id: this.gatewayInfo.sensors.monthlyESSChargeEnergy,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(
      socket.subscribeSensor(monthlyESSChargeEnergy,
        data => this.props.onUpdateESSCharge({
          thisMonth: +(+data.value / 1000).toFixed(1)
        }))
    );

    const dailyESSChargeEnergy = {
      id: this.gatewayInfo.sensors.dailyESSChargeEnergy,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(
      socket.subscribeSensor(dailyESSChargeEnergy,
        data => this.props.onUpdateESSCharge({
          today: data.value
        }))
    );

    const eSSChargePower = {
      id: this.gatewayInfo.sensors.eSSChargePower,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(eSSChargePower, (data, info) => {
      const curPower = +data.value;
      this.props.onUpdateESSCharge({ curPower: curPower.toFixed(1) });
      this.props.onUpdateESSStatus(curPower < 0);

      this.props.onUpdateChartData({
        id: info.id,
        owner: info.owner,
        time: data.time,
        value: data.value
      });
    }));

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlyESSChargeEnergy, query)
      .then(res => this.props.onUpdateESSCharge({
        thisMonth: +(+_.get(res.data, SERIES_DATA_PATH, '') / 1000).toFixed(1)
      }));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailyESSChargeEnergy, query)
      .then(res => this.props.onUpdateESSCharge(
        { today: +_.get(res.data, SERIES_DATA_PATH, '') }
      ));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.ESSInstallationCapacity, query)
      .then(res => this.props.onUpdateESSCharge({
        capacity: +_.get(res.data, SERIES_DATA_PATH, '')
      }));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.eSSChargePower, query)
      .then(res => {
        const curPower = +_.get(res.data, SERIES_DATA_PATH, '');
        this.props.onUpdateESSCharge({ curPower: curPower.toFixed(1) });
        this.props.onUpdateESSStatus(curPower < 0);
      });
  }

  initAndSubscribeWeatherData() {
    const sensors = this.gatewayInfo.sensors;
    const gwId = this.gatewayInfo.gwId;
    const weather = this.gatewayInfo.meta.weather;

    //subscribe sensors for ws
    const tempSensor = {
      id: sensors.temperature,
      owner: gwId
    };
    this.wsSubscribers.push(socket.subscribeSensor(tempSensor, data => this.props.onUpdateWeather({ temperature: data.value })));

    const humiditySensor = {
      id: sensors.humidity,
      owner: gwId
    }
    this.wsSubscribers.push(socket.subscribeSensor(humiditySensor, data => this.props.onUpdateWeather({ humidity: data.value })));

    const weatherSensor = {
      id: weather.id,
      owner: weather.owner
    }
    this.wsSubscribers.push(
      socket.subscribeSensor(weatherSensor,
        data => this.props.onUpdateWeather({ weather: data.value }))
    );

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(gwId, sensors.temperature, query).then(res => this.props.onUpdateWeather({ temperature: +_.get(res.data, SERIES_DATA_PATH, '') }));
    sensorService.getSensorData(gwId, sensors.humidity, query).then(res => this.props.onUpdateWeather({ humidity: +_.get(res.data, SERIES_DATA_PATH, '') }));
    sensorService.getSensorData(weather.owner, weather.id, query)
    .then(res =>
      this.props.onUpdateWeather({
        weather: _.get(res.data, SERIES_DATA_PATH, '')
      })
    );
  }

  getSensorSeries(gwId, sensorIds, startTime, endTime, interval = '0m') {
    const query = {
      embed: 'sensors',
      'sensors[embed]': 'series',
      'sensors[series][dataStart]': (new Date(startTime)).toISOString(),
      'sensors[series][dataEnd]': (new Date(endTime)).toISOString(),
      'sensors[series][interval]': interval
    };

    if (!_.isEmpty(sensorIds)) {
      query['sensors[filter][id]'] = sensorIds;
    }

    return sensorService.getSensorsData(gwId, query);
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
            isActive={this.props.isESSCharging} />

          <CardMobile type={BATTERY_2} titleName='ESS방전량'
            titleImage={battery2} data={this.props.ESSDischarge}
            isActive={!this.props.isESSCharging}
            batteryStatus={this.props.batteryStatus} />

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
  onUpdateWeather: (data) => dispatch(updateWeather(data)),
  onUpdateDateTime: ([date, time]) => date && time && dispatch(updateDateTime({ date, time })),
  onUpdateLocation: location => dispatch(updateLocation(location)),  
  onFetchingCurrentUser: () => dispatch(getUsersMe()),
  onInitialChartData: sensorData => dispatch(initialChartData(sensorData)),
  onUpdateChartData: data => dispatch(updateChartData(data)),
  onUpdateSolarEnergy: data => dispatch(updateSolarEnergy(data)),
  onUpdateGridEnergy: data => dispatch(updateGridEnergy(data)),
  onUpdateESSDischarge: data => dispatch(updateESSDischarge(data)),
  onUpdateESSCharge: data => dispatch(updateESSCharge(data)),
  onUpdateESSStatus: data => dispatch(updateESSStatus(data)),
  onUpdateBatteryStatus: data => dispatch(updateBatteryStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardMobile));