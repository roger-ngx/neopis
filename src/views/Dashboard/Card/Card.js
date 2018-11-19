import React from 'react';
import './Card.css';
import CardTitle from '../../../components/CardTitle/CardTitle';
import CurrentElectricityValue from '../../../components/CurrentElectricityValue/CurrentElectricityValue';
import CurrentBatteryPercentage from '../../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';
import DonutChartWithCss from '../../../components/ElectricityChart/DonutChartWithCss';
import classnames from 'classnames';
import BatteryMode from '../../../components/BatteryMode/BatteryMode';


const Card = props => {

  let cardClasses = classnames({
    'db_card': true,
    'l_card': +props.type === 1,
    'r_card': +props.type === 2
  });

  let cardBottom;
  if (+props.type === 2) {
    cardBottom = <>
      <BatteryMode status='Manual'/><CurrentBatteryPercentage value='45%'/>;
      </>
  } else {
    cardBottom = <DonutChartWithCss percentage='42%' electricity='851kW' />;
  }

  return <div className={cardClasses}>
    <div className='db_card_title'>
      <CardTitle title={props.titleName} image={props.titleImage} />
    </div>
    <div className='db_card_middle'>
      <CurrentElectricityValue type='1' value="912.9" unit="kWh" description="Monthly Total" />
      <CurrentElectricityValue type='2' value="29.3" unit="kWh" description="Daily Total" />
    </div>
    <div className="db_card_bottom">
      <div className="content">
        {cardBottom}
      </div>
    </div>
  </div>
}

export default Card;