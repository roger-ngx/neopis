import React from 'react';
import './CardTitle.css';

const CardTitle = (props) =>
  <div className='card_title'>
    <div className='title_name'>
      {props.title}
    </div>
    <div className='title_icon'>
      <img src={props.image} alt='title icon' />
    </div>
  </div>

export default CardTitle;  