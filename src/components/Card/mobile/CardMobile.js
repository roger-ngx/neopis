import React from 'react';
import './CardMobile.scss';
import CurrentBatteryPercentage from '../../CurrentBatteryPercentage/CurrentBatteryPercentage';
import CardTitle from '../../CardTitle/CardTitle';
import PowerDonutChart from '../../PowerChart/PowerDonutChart';
import BatteryMode from '../../BatteryMode/BatteryMode';
import { BATTERY_2 } from '../../CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import CurrentElectricityValueMobile from '../../CurrentElectricityValue/mobile/CurrentElectricityValueMobile';
import DonutChart from '../../PowerChart/DonutChart';
import { injectIntl } from 'react-intl';

const CardMobile = props => {
  const { intl } = props

  let cardRight;
  if (+props.type === BATTERY_2) {
    cardRight = <>
      <BatteryMode status={props.batteryStatus} />
      <CurrentBatteryPercentage value={props.data.batteryRate} mobile={true} />;
    </>
  } else {
    if (!!window.chrome && !!window.chrome.csi) {
      cardRight = <PowerDonutChart type={props.type}
        percentage={props.data.percentage}
        size={112} description={props.description}
        electricity={(props.data.curPower || 0) + 'kW'} />;
    } else {
      cardRight = <DonutChart type={props.type}
        percentage={props.data.percentage}
        size={112} description={props.description}
        electricity={(props.data.curPower || 0) + 'kW'} />;
    }
  }

  return <div className='m_db_card'>
    <div className='m_db_card_title'>
      <CardTitle title={props.titleName} image={props.titleImage} />
    </div>
    <div className='m_db_card_body'>
      <div className='m_db_card_body_left'>
        <CurrentElectricityValueMobile
          type={props.type} value={props.data.thisMonth}
          unit="MWh" description={intl.formatMessage({id: 'neopis.thisMonth'})}
          isActive={props.isActive} />

        <CurrentElectricityValueMobile
          type={props.type} value={props.data.today}
          unit="kWh" description={intl.formatMessage({id: 'neopis.today'})}
          isActive={props.isActive} />
      </div>
      <div className="m_db_card_body_right">
        {cardRight}
      </div>
    </div>
  </div>
}

export default injectIntl(CardMobile);