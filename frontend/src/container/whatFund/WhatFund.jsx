import React from 'react';
import Feature from '../../components/feature/Feature';
import './whatFund.css'

function WhatFund() {
  return <div className='bcsc__whatfund section__margin' id='whatfund'>
    <div className='bcsc__whatfund-features'>
    <Feature title="What is Blockfund" text="We so opinion friends me message as delight. Whole front do of plate heard oh ought. His defective nor convinced residence own. Connection has put impossible own apartments boisterous. At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by." />
  </div>
  <div className='bcsc__whatfund-heading'>
    <h1 className='gradient__text'>Make things possible in a Crowd</h1>
    <p>Apes together Strong</p>
  </div>
  <div className='bcsc__whatfund-container'>
  <Feature title="Investments" text="We so opinion friends me message as delight. Whole front do of plate heard oh ought." />
      <Feature title="Knowledgebase" text="At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by. As put impossible own apartments b" />
      <Feature title="Education" text="At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by. As put impossible own apartments b" />
      <Feature title="Security" text="At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by. As put impossible own apartments b" />

  </div>
  </div>;
}

export default WhatFund;
