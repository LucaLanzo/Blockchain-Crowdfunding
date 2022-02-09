import React from 'react';
import Feature from '../../components/feature/Feature';
import './whatFund.css'

function WhatFund() {
  return <div className='bcsc__whatfund section__margin' id='whatfund'>
    <div className='bcsc__whatfund-features'>
    <Feature title="What is Blockfunding?" text="CHANGE" />
  </div>
  <div className='bcsc__whatfund-heading'>
    <h1 className='gradient__text'>The advantages you will get when using Blockfunding</h1>
  </div>
  <div className='bcsc__whatfund-container'>
  <Feature title="Investments" text="CHANGE" />
      <Feature title="Knowledgebase" text="CHANGE" />
      <Feature title="Education" text="CHANGE" />
      <Feature title="Security" text="CHANGE" />

  </div>
  </div>;
}

export default WhatFund;
