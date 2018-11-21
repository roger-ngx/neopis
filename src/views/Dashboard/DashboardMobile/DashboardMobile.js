import React from 'react';
import './DashboardMobile.css';
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
import { updateBatteryInfor } from '../../../store/actionCreators';
import userService from '../../../services/userService';
import LineChartCrs from '../../../components/ElectricityChart/LineChartWithCrossHairs/LineChartCrs';

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

  componentDidMount() {
    userService.me().then(data => console.log(data));
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
          <CardMobile type={SOURCE} titleName='태양광 발전량' titleImage={energy} description='현재 발전 전력' data={this.props.energyInfo} />
          <CardMobile type={BATTERY_1} titleName='ESS충전량' titleImage={battery1} description='현재 ESS 방전 전력' data={this.props.batteryInfo} />
          <CardMobile type={BATTERY_2} titleName='ESS방전량' titleImage={battery2} data={this.props.batteryInfo} />
          <CardMobile type={ELECTRICITY} titleName='계통 송수전 전력량' titleImage={electricity} description='현재 계통 송수전 전력' data={this.props.electricityInfo} />
        </Slider>
      </div>

      <div className='m_db_chart'>
          <LineChartCrs />
      </div>
    </div>
  }
}

const mapStateToProps = state => ({
  energyInfo: state.solarEnergy,
  electricityInfo: state.generatedElectricity,
  batteryInfo: state.batteryStorage
});

const mapDispatchToProps = dispatch => ({
  onUpdateBatteryInfo: () => dispatch(updateBatteryInfor({
    thisMonth: (Math.random() * 1000).toFixed(1),
    today: (Math.random() * 100).toFixed(1),
    percentage: Math.round(Math.random() * 100)
  }))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardMobile));