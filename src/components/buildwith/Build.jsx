import React from 'react';
import { js, meta, solidity, web3, react } from './imports';
import './build.css';

function Build() {
  return <div className='bcsc__build section__padding'>
  <div>
    <h2>Build With:</h2>
  </div>
  <div>
    <img src={js} alt='JavaScript' />
  </div>
  <div>
    <img src={meta} alt='MetaMask' />
  </div>
  <div>
    <img src={solidity} alt='Solidity' />
  </div>
  <div>
    <img src={web3} alt='Web3' />
  </div>
  <div>
    <img src={react} alt='React' />
  </div>
      
  </div>;
}

export default Build;
