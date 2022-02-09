import React, { useState } from 'react';
import './header.css'
import blockchain from '../../assets/blockchain.png'
import { createNewProject } from '../../web3/Web3Client'


function Header() {
  const [title, setTitle] = useState('');
  const [descr, setDescr] = useState('');
  const [goal, setGoal] = useState(0);
  const [deadline, setDeadline] = useState(0);

  const createNewProjectMethod = () => {
    const newProjectEvent = createNewProject(title, descr, goal, deadline);
  }

  return <div className='bcsc__header section__padding' id='home'>
      <div className='bcsc__header-content'>
        <h1 className='gradient__text'>
          Invest in your favourite Projects using Crypto!
        </h1>
        <p>
        Deploy a new Project with Blockfunding
        </p>
      <div className='bcsc__header-content__input'>
        <div className='input_wrapper'>
        <input type='text' placeholder='Title' onChange={event => setTitle(event.target.value)}/>
        <input type='text' placeholder='Description' onChange={event => setDescr(event.target.value)}/>
        <input type='number' placeholder='Goal in Wei' onChange={event => setGoal(event.target.value)}/>
        <input type='number' placeholder='Time in days' onChange={event => setDeadline(event.target.value)} />
        </div>
        <div className='button_wrapper'>
         <button className='rotate-center' type='button' 
         onClick={() => createNewProjectMethod()}
         >
         Create Project
         </button>
        </div>
      </div>
      </div>

      <div className='bcsc__header-image'>
          <img src={blockchain} alt='blockchain'/>
        </div>
  </div>;
}

export default Header;
