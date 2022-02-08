/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Project } from '../../components';
import { getAllProjectContracts, getAllProjectAddresses, getProjectView } from '../../web3/Web3Client';
import './projectOverview.css'

const ProjectOverview = () => { 
  const[projectAddresses, setProjectAddresses] = useState({});
  const[projectContracts, setProjectContracts] = useState({});
  const[projectViews, setProjectViews] = useState({});
  
  useEffect(() => {
    getAllProjectAddresses()
    .then(tx => 
      setProjectAddresses(tx)
    );

    getAllProjectContracts(projectAddresses)
    .then(tx =>
      setProjectContracts(tx)
    );
    
    let projectViewsLocal = []
    for (var i = 0; i < projectContracts.length; i++) {
      getProjectView(projectContracts[i])
      .then(tx => 
        console.log(tx)
      )
    }
    setProjectViews(projectViewsLocal);

  }, [JSON.stringify(projectAddresses)])

  return (
  
    <div className="bcsc__projectOverview section__padding" id="project">
      <div className="bcsc__projectOverview-heading">
        <h1 className="gradient__text">Take a look at the <br /> deployed projects.</h1>
      </div>

      {
        console.log(projectAddresses)
      } 
      {
        console.log(projectContracts)
      }
      {
        console.log(projectViews)
      }
      
      <div className="bcsc__projectOverview-container">
        {
          // Array.from(projectContracts).map(project => (
          //   <div className="bcsc__projectOverview-container_group">
          //     <Project date={project._startedAt} title={project._title} description={project._descr} amountToRaise={project._amountToRaise} currentBalance={project._currentBalance} deadline={project._deadline}/>
          //   </div>
          // ))
        }

      </div>
    </div>
  );
}

export default ProjectOverview;

