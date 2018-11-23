import React from 'react';
import './CardTitle.scss';
import { PropTypes } from 'prop-types';

const CardTitle = (props) =>
  <div className='card_title'>
    <div className='title_name'>
      {props.title}
    </div>
    <div className='title_icon'>
      <img src={props.image} alt='title icon' />
    </div>
  </div>

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
}

export default CardTitle;