import React from 'react';
import { CurrentElectricityValue } from '../../components/CurrentElectricityValue/CurrentElectricityValue';
import './Components.css';
import { CurrentElectricityValueMobile } from '../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import CardTitle from '../../components/CardTitle/CardTitle';
import withStyles from "@material-ui/core/styles/withStyles";
import CurrentBatteryPercentage from '../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';
import CurrentMoment from '../../components/CurrentMoment/CurrentMoment';
import CurrentWeather from '../../components/CurrentWeather/CurrentWeather';
import { CurrentLocation } from '../../components/CurrentLocation/CurrentLocation';
import CurrentMomentMobile from '../../components/CurrentMoment/mobile/CurrentMomentMobile';
import CurrentWeatherMobile from '../../components/CurrentWeather/mobile/CurrentWeatherMobile';
import Grid from '@material-ui/core/Grid';
import CurrentLocationMobile from '../../components/CurrentLocation/mobile/CurrentLocationMobile';

const styles = {
  root: {
    flexGrow: 1,
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

class Components extends React.Component {

  render() {
    const { classes, ...rest } = this.props;
    return <div className="np_components">

      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={3}>
          <CurrentElectricityValue type='1' value="912.9" unit="kWh" description="Monthly Total" />
        </Grid>
        <Grid item xs={3}>
          <CurrentElectricityValueMobile type='3' value="912.9" unit="kWh" description="Monthly Total" />
        </Grid>
        <Grid item xs={6}>
          <CardTitle title='ESS충전량' />
        </Grid>
      </Grid>

      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}>
          <CurrentBatteryPercentage />
        </Grid>
        <Grid item xs={6}>
        </Grid>
      </Grid>

      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={4}>
          <CurrentWeather temperature='23°' humidity='75%' />
        </Grid>
        <Grid item xs={4}>
          <CurrentMoment date='2018 / 10 / 26 / 수요일' time='15 : 30 : 00' />
        </Grid>
        <Grid item xs={4}>
          <CurrentLocation location='강원도 고성군 간성읍 금수리 산 40-4' />
        </Grid>
      </Grid>

      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={4}>
          <CurrentMomentMobile date='2018 / 10 / 26 / 수요일' time='15 : 30 : 00' />
        </Grid>
        <Grid item xs={4}>
          <CurrentWeatherMobile temperature='23°' humidity='75%' />
        </Grid>
        <Grid item xs={4}>
          <CurrentLocationMobile location='강원도 고성군 간성읍 금수리 산 40-4' />
        </Grid>
      </Grid>

      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}>
        </Grid>
        <Grid item xs={6}>
        </Grid>
      </Grid>
    </div>
  }
}

export default withStyles(styles)(Components);