import React from 'react';
import './CardMobile.css';
import CurrentBatteryPercentage from '../../../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';
import CurrentElectricityValueMobile from '../../../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import CardTitle from '../../../../components/CardTitle/CardTitle';
import DonutChartWithCss from '../../../../components/ElectricityChart/DonutChartWithCss';
import BatteryMode from '../../../../components/BatteryMode/BatteryMode';

const CardMobile = props => {

  let cardRight;
  if (+props.type === 2) {
    cardRight = <>
    <BatteryMode status='Manual'/>
    <CurrentBatteryPercentage value='20%' mobile='true'/>;
    </>
  } else {
    cardRight = <DonutChartWithCss percentage='92%' electricity='851kW' />;
  }

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
        {cardRight}
      </div>
    </div>
  </div>
}

export default CardMobile;