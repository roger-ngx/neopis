import React from 'react';
import _ from 'lodash';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Dashboard.scss';
import Card from '../../components/Card/Card';
import AppBar from '../../components/AppBar/AppBar';
import LineChart from '../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';
import { SOURCE, BATTERY_1, BATTERY_2, ELECTRICITY } from '../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';

import battery1 from '../../assets/images/battery-1.svg';
import battery2 from '../../assets/images/battery-2.svg';
import electricity from '../../assets/images/electricity.svg';
import energy from '../../assets/images/energy.svg';

import { DashboardWrapper } from './DashboardWrapper';

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

const Dashboard = (props) => {
  const { classes } = props;
  if (_.isEmpty(props.gatewayInfo)) {
    return <div className="db_loading">
      <div className="db_progress">
        <CircularProgress color="secondary" />
      </div>
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
          data={props.solarEnergy}
          devices={
            {
              gwId: props.gatewayInfo.gwId,
              sensors: [
                props.gatewayInfo.sensors.monthlySolarGenEnergy,
                props.gatewayInfo.sensors.dailySolarGenEnergy,
                props.gatewayInfo.sensors.solargenPower
              ]
            }
          } />
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <Card type={BATTERY_1} titleName='ESS충전량'
              titleImage={battery1}
              description={props.isESSCharging ? '현재 ESS 충전 전력' : '현재 ESS 방전 전력'}
              data={props.ESSCharge}
              isActive={props.isESSCharging}
              devices={
                {
                  gwId: props.gatewayInfo.gwId,
                  sensors: [
                    props.gatewayInfo.sensors.monthlyESSChargeEnergy,
                    props.gatewayInfo.sensors.dailyESSChargeEnergy,
                    props.gatewayInfo.sensors.eSSChargePower
                  ]
                }
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card type={BATTERY_2} titleName='ESS방전량'
              titleImage={battery2}
              data={props.ESSDischarge}
              isActive={!props.isESSCharging}
              batteryStatus={props.batteryStatus}
              devices={
                {
                  gwId: props.gatewayInfo.gwId,
                  sensors: [
                    props.gatewayInfo.sensors.monthlyESSDischargeEnergy,
                    props.gatewayInfo.sensors.dailyESSDischargeEnergy,
                    props.gatewayInfo.sensors.batteryRate
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
          data={props.electricityInfo}
          devices={
            {
              gwId: props.gatewayInfo.gwId,
              sensors: [
                props.gatewayInfo.sensors.monthlyGridEnergy,
                props.gatewayInfo.sensors.dailyGridEnergy,
                props.gatewayInfo.sensors.gridPower
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

export default DashboardWrapper(withStyles(styles)(Dashboard))