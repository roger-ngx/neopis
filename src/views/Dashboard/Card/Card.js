import React from 'react';
import './Card.css';
import CardTitle from '../../../components/CardTitle/CardTitle';
import { CurrentElectricityValue } from '../../../components/CurrentElectricityValue/CurrentElectricityValue';
import CurrentBatteryPercentage from '../../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';

const Card = props => {
  return <div className='db_card'>
    <div className='db_card_title'>
      <CardTitle title={props.titleName} image={props.titleImage} />
    </div>
    <div className='db_card_middle'>
      <CurrentElectricityValue type='1' value="912.9" unit="kWh" description="Monthly Total" />
      <CurrentElectricityValue type='2' value="29.3" unit="kWh" description="Daily Total" />
    </div>
    <div className="db_card_bottom">
      <CurrentBatteryPercentage />
    </div>
  </div>
}

export default Card;