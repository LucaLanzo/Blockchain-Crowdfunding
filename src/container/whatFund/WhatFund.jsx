import React from 'react';
import Feature from '../../components/feature/Feature';
import './whatFund.css'

function WhatFund() {
  return <div className='bcsc__whatfund section__margin' id='whatfund'>
    <div className='bcsc__whatfund-features'>
    <Feature title="What is Blockfunding?" text="We have implemented a crowdfunding platform entirely based on the Ethereum blockchain. You can start your own projects directly through our website which uses smart contracts which are deployed on the Ethereum blockchain." />
  </div>
  <div className='bcsc__whatfund-heading'>
    <h1 className='gradient__text'>The advantages of Blockfunding</h1>
  </div>
  <div className='bcsc__whatfund-container'>
    <Feature title="Economical" text="You will not have to pay a middle man or us." />
    <Feature title="Censor-free" text="Present your wildest ideas to the masses without censorship." />
    <Feature title="Reachability" text="Reach thousands of DeFi users with your ideas!" />
    <Feature title="Security" text="The smart contract is on the Ethereum blockchain, the safest place for your funds." />

  </div>
  </div>;
}

export default WhatFund;
