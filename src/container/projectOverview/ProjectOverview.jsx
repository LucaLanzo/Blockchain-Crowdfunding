/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Project } from '../../components';
import { getAllProjectContracts, getAllProjectAddresses, getAllProjectViews, checkIfProjectEnded, getSingleProjectContracts, fund, selectedAccount, payout, refund } from '../../web3/Web3Client';
import './projectOverview.css'

export 
const ProjectOverview = () => { 
  const states = new Map();

  states.set(0, 'Raising');
  states.set(1, 'Raised');
  states.set(2, 'Expired');
  states.set(3, 'Refunded');
  states.set(4, 'Paid Out');

  const [projectAddresses, setProjectAddresses] = useState({});
  const [projectContracts, setProjectContracts] = useState({});
  const [projectViews, setProjectViews] = useState({});

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

  function convertToDate(unixDate) {
    var a = new Date(unixDate * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year;

    return time;
  }

  function convertToDeadline(unixDate) {
    var a = new Date(unixDate * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

    return time;
  }

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

  const checkIfProjectEndedMethod = (projectAddress) => {
    let projectContract;
    
    for (var i = 0; i < projectContracts.length; i++) {
      if (projectContracts[i]._address == projectAddress) {
        projectContract = projectContracts[i]
      }
    }

    checkIfProjectEnded(projectContract)
    .then(tx => console.log(tx))

    getAllProjectViewsMethod();
  }

  const fundMethod = (projectAddress, fundingAmount) => {
    let projectContract;
    
    for (var i = 0; i < projectContracts.length; i++) {
      if (projectContracts[i]._address == projectAddress) {
        projectContract = projectContracts[i]
      }
    }

    fund(projectContract, fundingAmount);

    setFundingAmount(0);

    getAllProjectViewsMethod();
  }

  const payoutMethod = (projectAddress) => {
    let projectContract;
    
    for (var i = 0; i < projectContracts.length; i++) {
      if (projectContracts[i]._address == projectAddress) {
        projectContract = projectContracts[i]
      }
    }

    payout(projectContract);

    getAllProjectViewsMethod();
  }

  const refundMethod = (projectAddress) => {
    let projectContract;
    
    for (var i = 0; i < projectContracts.length; i++) {
      if (projectContracts[i]._address == projectAddress) {
        projectContract = projectContracts[i]
      }
    }

    refund(projectContract);

    getAllProjectViewsMethod();
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
            <div>
              <div className="bcsc__projectOverview-container_group">
                {/* <div className='refresh_wrapper'>
                  <button className='refresh' onClick={() => checkIfProjectEndedMethod(project._projectAddress)}>Check for End</button>
                </div> */}
              
               <Project state={states.get(parseInt(project._state))} date={convertToDate(project._startedAt)} title={project._title} description={project._descr} amountToRaise={project._amountToRaise} currentBalance={project._currentBalance} deadline={convertToDeadline(project._deadline)}/>
            </div>
            
            <div className="bcsc__projectOverview-container_group">
              
              {/* Render fund button only when not creator and state is raising*/
                (new String(selectedAccount).valueOf().toLowerCase() !== new String(project._creator).valueOf().toLowerCase() && 0 == parseInt(project._state)) && (
                  <div>
                    <input type='number' min="1" placeholder='Funding in Wei' onChange={event => setFundingAmount(event.target.value)} />
                    <button onClick={() => fundMethod(project._projectAddress, fundingAmount)}>Fund!</button>
                  </div>
                )
              }
              {/* Render payout button only when creator and state is raised */
                (new String(selectedAccount).valueOf().toLowerCase() == new String(project._creator).valueOf().toLowerCase() && 1 == parseInt(project._state)) && (
                  <div className='refresh_wrapper'>
                    <button className='refresh' onClick={() => payoutMethod(project._projectAddress)}>PayOut</button>
                  </div>
                )
              }
              

              {/* Render refund button only when not creator and state is expired */
                (new String(selectedAccount).valueOf().toLowerCase() !== new String(project._creator).valueOf().toLowerCase() && 2 == parseInt(project._state)) && (
                  <div className='refresh_wrapper'>
                      <button className='refresh' onClick={() => refundMethod(project._projectAddress)}>Refund</button>
                  </div>
                )
              }
            </div>
          </div>
          ))
        }
      </div>
    </div>
  );
}

export default ProjectOverview;