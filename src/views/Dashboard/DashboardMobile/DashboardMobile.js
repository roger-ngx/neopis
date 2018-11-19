import React from 'react';
import './DashboardMobile.css';
import withStyles from "@material-ui/core/styles/withStyles";
import CurrentMomentMobile from '../../../components/CurrentMoment/mobile/CurrentMomentMobile';
import CurrentWeatherMobile from '../../../components/CurrentWeather/mobile/CurrentWeatherMobile';
import CurrentLocationMobile from '../../../components/CurrentLocation/mobile/CurrentLocationMobile';
import Grid from '@material-ui/core/Grid';
import CardMobile from '../Card/mobile/CardMobile';
import electricity from '../../../assets/images/electricity.svg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppBarMobile from '../../../components/AppBar/mobile/AppBarMobile';

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

  render() {
    const { classes, ...rest } = this.props;

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
        <Grid container sm={12} spacing={0} className={classes.root}>
          <Grid item xs={4} className={classes.m_db_title}>
            <CurrentMomentMobile date='2018 / 10 / 26 / 수요일' time='15 : 30 : 00' />
          </Grid>
          <Grid item xs={4} className={classes.m_db_title}>
            <CurrentWeatherMobile temperature='23°' humidity='75%' />
          </Grid>
          <Grid item xs={4} className={classes.m_db_title}>
            <CurrentLocationMobile location='강원도 고성군 간성읍 금수리 산 40-4' />
          </Grid>
        </Grid>
      </div>
      <div className='db_slider'>
        <Slider {...settings}>
          <CardMobile type='1' titleName='1' titleImage={electricity} />
          <CardMobile type='1' titleName='2' titleImage={electricity} />
          <CardMobile type='2' titleName='3' titleImage={electricity} />
          <CardMobile type='1' titleName='4' titleImage={electricity} />
        </Slider>
      </div>
    </div>
  }
}

export default withStyles(styles)(DashboardMobile);