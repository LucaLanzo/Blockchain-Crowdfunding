import React from 'react';
import './header.css'
import blockchain from '../../assets/blockchain.png'


function Header() {
  return <div className='bcsc__header section__padding' id='home'>
      <div className='bcsc__header-content'>
        <h1 className='gradient__text'>
          Invest with Crypto in your favourite Projects!
        </h1>
        <p>
        Get notifyed about new projects enter E-Mail address bla bla
        sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </p>
      <div className='bcsc__header-content__input'>
        <input type='email' placeholder='Your E-mail' />
        <button type='button'>Get Started</button>
      </div>
      </div>
      <div className='bcsc__header-image'>
          <img src={blockchain} alt='blockchain'/>
        </div>
  </div>;
}

export default Header;
