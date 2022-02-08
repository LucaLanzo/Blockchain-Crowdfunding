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
        Deploy a new Project with Blockfund
        </p>
      <div className='bcsc__header-content__input'>
        <input type='input' placeholder='Hello' />
        <button type='button'>Create Project</button>
      </div>
      </div>
      <div className='bcsc__header-image'>
          <img src={blockchain} alt='blockchain'/>
        </div>
  </div>;
}

export default Header;
