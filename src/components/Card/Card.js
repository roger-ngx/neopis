import React from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames';

import './Card.scss';
import CardTitle from '../CardTitle/CardTitle';
import CurrentElectricityValue from '../CurrentElectricityValue/CurrentElectricityValue';
import CurrentBatteryPercentage from '../CurrentBatteryPercentage/CurrentBatteryPercentage';
import PowerDonutChart from '../PowerChart/PowerDonutChart';
import BatteryMode from '../BatteryMode/BatteryMode';
import { BATTERY_2, BATTERY_1 } from '../CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import DonutChart from '../PowerChart/DonutChart';


const Card = props => {

  let cardClasses = classnames({
    'db_card': true,
    'l_card': +props.type === BATTERY_1,
    'r_card': +props.type === BATTERY_2
  });

  let cardBottom;
  if (+props.type === BATTERY_2) {
    cardBottom = <>
      <BatteryMode
        status={props.batteryStatus}
        gwId={props.devices.gwId}
        sensorId={props.devices.sensors[2]} />

      <CurrentBatteryPercentage
        value={props.data.batteryRate}
        gwId={props.devices.gwId}
        sensorId={props.devices.sensors[2]} />;
      </>
  } else {
    if (!!window.chrome && !!window.chrome.webstore) {
      cardBottom = <PowerDonutChart
        type={props.type}
        percentage={props.data.percentage}
        gwId={props.devices.gwId}
        sensorId={props.devices.sensors[2]}
        size={128}
        description={props.description}
        electricity={(props.data.curPower || 0) + 'kW'} />;
    } else {
      cardBottom = <DonutChart
        type={props.type}
        percentage={props.data.percentage}
        gwId={props.devices.gwId}
        sensorId={props.devices.sensors[2]}
        size={128}
        description={props.description}
        electricity={(props.data.curPower || 0) + 'kW'} />;
    }
  }

  return <div className={cardClasses}>
    <div className='db_card_title'>
      <CardTitle title={props.titleName} image={props.titleImage} />
    </div>
    <div className='db_card_middle'>
      <CurrentElectricityValue
        type={props.type}
        value={props.data.thisMonth}
        unit="MWh" description="This month"
        isActive={props.isActive}
        gwId={props.devices.gwId}
        sensorId={props.devices.sensors[0]} />
      <CurrentElectricityValue
        type={props.type}
        value={props.data.today}
        unit="kWh" description="Today"
        isActive={props.isActive}
        gwId={props.devices.gwId}
        sensorId={props.devices.sensors[1]} />
    </div>
    <div className="db_card_bottom">
      <div className="content">
        {cardBottom}
      </div>
    </div>
  </div>
}

Card.propTypes = {
  type: PropTypes.number.isRequired,
  titleName: PropTypes.string.isRequired,
  titleImage: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  description: PropTypes.string,
  isActive: PropTypes.bool,
  batteryStatus: PropTypes.number
}

Card.defaultProps = {
  isActive: true
}

export default Card;