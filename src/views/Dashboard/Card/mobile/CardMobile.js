import React from 'react';
import './CardMobile.css';
import CurrentBatteryPercentage from '../../../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';
import CardTitle from '../../../../components/CardTitle/CardTitle';
import DonutChartWithCss from '../../../../components/ElectricityChart/DonutChartWithCss';
import BatteryMode from '../../../../components/BatteryMode/BatteryMode';
import { BATTERY_2 } from '../../../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import CurrentElectricityValueMobile from '../../../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';

const CardMobile = props => {

  let cardRight;
  if (+props.type === BATTERY_2) {
    cardRight = <>
      <BatteryMode status='Manual' />
      <CurrentBatteryPercentage value={props.data.percentage} mobile={true} />;
    </>
  } else {
    cardRight = <DonutChartWithCss type={props.type} percentage={props.data.percentage}
      size={112} description={props.description} electricity='851kW' />;
  }

  return <div className='m_db_card'>
    <div className='m_db_card_title'>
      <CardTitle title={props.titleName} image={props.titleImage} />
    </div>
    <div className='m_db_card_body'>
      <div className='m_db_card_body_left'>
        <CurrentElectricityValueMobile type={props.type} value={props.data.thisMonth} unit="kWh" description="This month" />
        <CurrentElectricityValueMobile type={props.type} value={props.data.today} unit="kWh" description="Today" />
      </div>
      <div className="m_db_card_body_right">
        {cardRight}
      </div>
    </div>
  </div>
}

export default CardMobile;