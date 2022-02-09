/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Project } from '../../components';
import { getAllProjectContracts, getAllProjectAddresses, getAllProjectViews } from '../../web3/Web3Client';
import './projectOverview.css'

const ProjectOverview = () => { 
  const states = new Map();

  states.set(0, 'Raising');
  states.set(1, 'Raised');
  states.set(2, 'Expired');
  states.set(3, 'Refunded');
  states.set(4, 'Payout');


  const[projectAddresses, setProjectAddresses] = useState({});
  const[projectContracts, setProjectContracts] = useState({});
  const[projectViews, setProjectViews] = useState({});

  const [fundingAmount, setFundingAmount] = useState(0);
  
  useEffect(() => {
    getAllProjectAddresses()
    .then(tx => 
      setProjectAddresses(tx)
    );

    getAllProjectContracts(projectAddresses)
    .then(tx =>
      setProjectContracts(tx)
    );
    
  }, [JSON.stringify(projectAddresses)])

  const getAllProjectViewsMethod = () => {
    getAllProjectAddresses()
    .then(tx => 
      setProjectAddresses(tx)
    );

    getAllProjectContracts(projectAddresses)
    .then(tx =>
      setProjectContracts(tx)
    );

    getAllProjectViews(projectContracts)
    .then(tx => {
      setProjectViews(tx)
    });
  }

  function convertToDate(unixDate) {
    unixDate = parseInt(unixDate);
    let date = "";
    return date;
  }

  function convertToDeadline(unixDate) {
    unixDate = parseInt(unixDate);
    let date = "";

    return date;
  }

  return (
  
    <div className="bcsc__projectOverview section__padding" id="project">
      <div className="bcsc__projectOverview-heading">
        <h1 className="gradient__text">Take a look at the <br /> deployed projects.</h1>
      </div>
      
      <div className='refresh_wrapper'>
          <button className='refresh' onClick={() => getAllProjectViewsMethod()}>Show/Reload Projects</button>
        </div>
      
      <div className="bcsc__projectOverview-container">
        {
          Array.from(projectViews).map(project => (
            <div className="bcsc__projectOverview-container_group">
              <Project state={states.get(parseInt(project._state))} date={convertToDate(project._startedAt)} title={project._title} description={project._descr} amountToRaise={project._amountToRaise} currentBalance={project._currentBalance} deadline={convertToDeadline(project._deadline)}/>
              <input placeholder='Funding in Wei' onChange={event => setFundingAmount(event.target.value)} />
              <button onClick={() => fund()}>Fund!</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default ProjectOverview;