import React from 'react';
import './CardMobile.css';
import CurrentBatteryPercentage from '../../../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';
import { CurrentElectricityValueMobile } from '../../../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import CardTitle from '../../../../components/CardTitle/CardTitle';

const CardMobile = props => {
  return <div className='m_db_card'>
    <div className='m_db_card_title'>
      <CardTitle title={props.titleName} image={props.titleImage} />
    </div>
    <div className='m_db_card_body'>
      <div className='db_card_body_left'>
        <CurrentElectricityValueMobile type='1' value="912.9" unit="kWh" description="Monthly Total" />
        <CurrentElectricityValueMobile type='2' value="29.3" unit="kWh" description="Daily Total" />
      </div>
      <div className="db_card_body_right">
      </div>
    </div>
  </div>
}

export default CardMobile;