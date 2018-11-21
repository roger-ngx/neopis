import React from 'react';
import './Card.css';
import CardTitle from '../../../components/CardTitle/CardTitle';
import CurrentElectricityValue from '../../../components/CurrentElectricityValue/CurrentElectricityValue';
import CurrentBatteryPercentage from '../../../components/CurrentBatteryPercentage/CurrentBatteryPercentage';
import DonutChartWithCss from '../../../components/ElectricityChart/DonutChartWithCss';
import classnames from 'classnames';
import BatteryMode from '../../../components/BatteryMode/BatteryMode';
import { BATTERY_2, BATTERY_1 } from '../../../components/CurrentElectricityValue/mobile/CurrentElectricityValueMobile';


const Card = props => {

  let cardClasses = classnames({
    'db_card': true,
    'l_card': +props.type === BATTERY_1,
    'r_card': +props.type === BATTERY_2
  });

  let cardBottom;
  if (+props.type === BATTERY_2) {
    cardBottom = <>
      <BatteryMode status='Manual'/><CurrentBatteryPercentage value={props.data.percentage}/>;
      </>
  } else {
    cardBottom = <DonutChartWithCss type={props.type} percentage={props.data.percentage}
                                    size={128} description={props.description} electricity='851kW' />;
  }

  return <div className={cardClasses}>
    <div className='db_card_title'>
      <CardTitle title={props.titleName} image={props.titleImage} />
    </div>
    <div className='db_card_middle'>
      <CurrentElectricityValue type={props.type} value={props.data.thisMonth} unit="kWh" description="This month" />
      <CurrentElectricityValue type={props.type} value={props.data.today} unit="kWh" description="Today" />
    </div>
    <div className="db_card_bottom">
      <div className="content">
        {cardBottom}
      </div>
    </div>
  </div>
}

export default Card;