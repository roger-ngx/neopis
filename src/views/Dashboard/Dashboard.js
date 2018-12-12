import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from '@material-ui/core/Grid';

import './Dashboard.scss';
import Card from '../../components/Card/Card';
import AppBar from '../../components/AppBar/AppBar';
import LineChart from '../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';
import { SOURCE, BATTERY_1, BATTERY_2, ELECTRICITY } from '../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import { MANUAL, AUTOMATIC } from '../../components/BatteryMode/BatteryMode';
import BrowserSnackbar from '../../components/BrowserSnackbar/BrowserSnackbar'

import battery1 from '../../assets/images/battery-1.svg';
import battery2 from '../../assets/images/battery-2.svg';
import electricity from '../../assets/images/electricity.svg';
import energy from '../../assets/images/energy.svg';

import {
  getUsersMe,
  initialChartData,
  updateChartData,
  updateDateTime,
  updateWeather,
  updateSolarEnergy,
  updateGridEnergy,
  updateESSDischarge,
  updateESSCharge,
  updateESSStatus,
  updateBatteryStatus,
  updateLocation
} from '../../store/actionCreators';

import socket from '../../services/wsServices';
import sensorService from '../../services/sensorService'

//const LineChart = lazy(() => import('../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs'));
import Snackbar from '@material-ui/core/Snackbar';

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

const SERIES_DATA_PATH = 'data.series.value';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.wsSubscribers = [];
  }

  componentDidMount() {
    this.props.onFetchingCurrentUser();
    socket.initSocketChannel();

    this.init();
  }

  async init() {
    const gwInfo = await sensorService.getGatewayInfo();
    this.gatewayInfo = _.pick(_.get(gwInfo.data, ['data', '0']), ['name', 'gwId', 'sensors']);

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
    this.wsSubscribers.push(
      socket.subscribeSensor(monthlyESSDischargeEnergy,
        data => this.props.onUpdateESSDischarge({
          thisMonth: +(+data.value / 1000).toFixed(1)
        }))
    );

    const dailyESSDischargeEnergy = {
      id: this.gatewayInfo.sensors.dailyESSDischargeEnergy,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(
      socket.subscribeSensor(dailyESSDischargeEnergy,
        data => this.props.onUpdateESSDischarge({
          today: parseInt(data.value)
        }))
    );

    const batteryRate = {
      id: this.gatewayInfo.sensors.batteryRate,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(
      socket.subscribeSensor(batteryRate,
        data => this.props.onUpdateESSDischarge({
          batteryRate: (+data.value).toFixed(1)
        }))
    );

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.monthlyESSDischargeEnergy, query)
      .then(res => this.props.onUpdateESSDischarge({
        thisMonth: parseInt(_.get(res.data, SERIES_DATA_PATH, '') / 1000)
      }));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.dailyESSDischargeEnergy, query)
      .then(res => this.props.onUpdateESSDischarge({
        today: parseInt(_.get(res.data, SERIES_DATA_PATH, ''))
      }));

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.batteryRate, query)
      .then(res => this.props.onUpdateESSDischarge({
        batteryRate: parseInt(_.get(res.data, SERIES_DATA_PATH, ''))
      }));
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
    //subscribe sensors for ws
    const tempSensor = {
      id: this.gatewayInfo.sensors.temperature,
      owner: this.gatewayInfo.gwId
    };
    this.wsSubscribers.push(
      socket.subscribeSensor(tempSensor,
        data => this.props.onUpdateWeather({ temperature: data.value }))
    );

    const humiditySensor = {
      id: this.gatewayInfo.sensors.humidity,
      owner: this.gatewayInfo.gwId
    }
    this.wsSubscribers.push(
      socket.subscribeSensor(humiditySensor,
        data => this.props.onUpdateWeather({ humidity: data.value }))
    );

    //query for the 1st data
    var query = {
      embed: ['series'],
    };

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.temperature, query)
      .then(res =>
        this.props.onUpdateWeather({
          temperature: +_.get(res.data, SERIES_DATA_PATH, '')
        })
      );

    sensorService.getSensorData(this.gatewayInfo.gwId, this.gatewayInfo.sensors.humidity, query)
      .then(res =>
        this.props.onUpdateWeather({
          humidity: +_.get(res.data, SERIES_DATA_PATH, '')
        })
      );
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

  getSensorValues(gwId, sensorIds) {
    const query = {
      embed: 'sensors',
      'sensors[embed]': 'series',
      'sensors[filter][id]': sensorIds
    };

    return sensorService.getSensorsData(gwId, query);
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

  componentWillUnmount() {
    _.forEach(this.wsSubscribers, unsubscriber => unsubscriber());

    socket.disconnectSocketChannel();
  }

  render() {
    const { classes } = this.props;
    if (_.isEmpty(this.gatewayInfo)) {
      return <div className="db_chart_loading">
        Loading...
        </div>
    }

    return <div className="np_dashboard">
      <div className="np_app_bar">
        <AppBar />
      </div>
      <Grid container className={classes.root} spacing={8}>
        <Grid item xs={12} md={3}>
          <Card type={SOURCE} titleName='태양광 발전량'
            titleImage={energy} description='현재 발전 전력'
            data={this.props.solarEnergy}
            devices={
              {
                gwId: this.gatewayInfo.gwId,
                sensors: [
                  this.gatewayInfo.sensors.monthlySolarGenEnergy,
                  this.gatewayInfo.sensors.dailySolarGenEnergy,
                  this.gatewayInfo.sensors.solargenPower
                ]
              }
            } />
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <Card type={BATTERY_1} titleName='ESS충전량'
                titleImage={battery1}
                description={this.props.isESSCharging ? '현재 ESS 충전 전력' : '현재 ESS 방전 전력'}
                data={this.props.ESSCharge}
                isActive={this.props.isESSCharging}
                devices={
                  {
                    gwId: this.gatewayInfo.gwId,
                    sensors: [
                      this.gatewayInfo.sensors.monthlyESSChargeEnergy,
                      this.gatewayInfo.sensors.dailyESSChargeEnergy,
                      this.gatewayInfo.sensors.eSSChargePower
                    ]
                  }
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card type={BATTERY_2} titleName='ESS방전량'
                titleImage={battery2}
                data={this.props.ESSDischarge}
                isActive={!this.props.isESSCharging}
                batteryStatus={this.props.batteryStatus}
                devices={
                  {
                    gwId: this.gatewayInfo.gwId,
                    sensors: [
                      this.gatewayInfo.sensors.monthlyESSDischargeEnergy,
                      this.gatewayInfo.sensors.dailyESSDischargeEnergy,
                      this.gatewayInfo.sensors.batteryRate
                    ]
                  }
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card type={ELECTRICITY} titleName='계통 송수전 전력량'
            titleImage={electricity}
            description='현재 계통 송수전 전력'
            data={this.props.electricityInfo}
            devices={
              {
                gwId: this.gatewayInfo.gwId,
                sensors: [
                  this.gatewayInfo.sensors.monthlyGridEnergy,
                  this.gatewayInfo.sensors.dailyGridEnergy,
                  this.gatewayInfo.sensors.gridPower
                ]
              }
            } />
        </Grid>
      </Grid>
      <Grid container className='db_chart'>
        <Grid item xs={12}>
          <LineChart />
        </Grid>
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
  batteryStatus: state.batteryStatus
});

const mapDispatchToProps = dispatch => ({
  onUpdateWeather: ({ temperature, humidity }) => dispatch(updateWeather({ temperature, humidity })),
  onUpdateDateTime: ([date, time]) => date && time && dispatch(updateDateTime({ date, time })),
  onUpdateLocation: location => dispatch(updateLocation(location)),
  onFetchingCurrentUser: () => dispatch(getUsersMe()),
  onInitialChartData: (sensorData) => dispatch(initialChartData(sensorData)),
  onUpdateChartData: data => dispatch(updateChartData(data)),
  onUpdateSolarEnergy: data => dispatch(updateSolarEnergy(data)),
  onUpdateGridEnergy: data => dispatch(updateGridEnergy(data)),
  onUpdateESSDischarge: data => dispatch(updateESSDischarge(data)),
  onUpdateESSCharge: data => dispatch(updateESSCharge(data)),
  onUpdateESSStatus: data => dispatch(updateESSStatus(data)),
  onUpdateBatteryStatus: data => dispatch(updateBatteryStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));