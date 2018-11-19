import React from 'react';
import { CurrentElectricityValue } from '../../components/CurrentElectricityValue/CurrentElectricityValue';
import './Dashboard.css';
import { CurrentElectricityValueMobile } from '../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import { CardTitle } from '../../components/CardTitle/CardTitle';
import withStyles from "@material-ui/core/styles/withStyles";
import CurrentBatteryPercentage from '../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';
import CurrentMoment from '../../components/CurrentMoment/CurrentMoment';
import CurrentWeather from '../../components/CurrentWeather/CurrentWeather';
import { CurrentLocation } from '../../components/CurrentLocation/CurrentLocation';
import CurrentMomentMobile from '../../components/CurrentMoment/mobile/CurrentMomentMobile';
import CurrentWeatherMobile from '../../components/CurrentWeather/mobile/CurrentWeatherMobile';
import Grid from '@material-ui/core/Grid';
import { CurrentLocationMobile } from '../../components/CurrentLocation/mobile/CurrentLocationMobile';
import Card from './Card/Card';

import battery1 from '../../assets/images/battery-1.svg';
import battery2 from '../../assets/images/battery-2.svg';
import electricity from '../../assets/images/electricity.svg';
import energy from '../../assets/images/energy.svg';
import AppBar from '../../components/AppBar/AppBar';
import { LineChart } from '../../components/ElectricityChart/LineChart/LineChart';
import { LineChartCrs } from '../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';



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

  render() {
    const { classes, ...rest } = this.props;
    return <div className="np_dashboard">
      <div className="np_app_bar">
        <AppBar />
      </div>
      <Grid container className={classes.root} spacing={8}>
        <Grid item xs={12} md={3}>
          <Card titleName='태양광 발전량' titleImage={energy} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <Card type='1' titleName='ESS충전량' titleImage={battery1} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card type='2' titleName='ESS방전량' titleImage={battery2} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card titleName='계통 송수전 전력량' titleImage={electricity} />
        </Grid>
      </Grid>
      {/* <div className='db_chart'>
        <LineChartCrs />
      </div> */}
      <Grid container className='db_chart'>
        <Grid item xs={12}>
          <LineChartCrs />
        </Grid>
      </Grid>
    </div>
  }
}

export default withStyles(styles)(Dashboard);