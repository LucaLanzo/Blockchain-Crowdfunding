import React, { useState, useEffect } from 'react';
import { Project } from '../../components';
import { getAllProjects } from '../../web3/Web3Client';
import './projectOverview.css'
// import { projectContractsView } from '../../web3/Web3Client'

const ProjectOverview = () => { 
  const[projectContractsView, setProjectContractsView] = useState({})
  
  useEffect(() => {
    getAllProjects()
    .then(tx => 
      console.log(tx)
    )
  }, [])

  return (
  
    <div className="bcsc__projectOverview section__padding" id="project">
      <div className="bcsc__projectOverview-heading">
        <h1 className="gradient__text">Take a look at the, <br /> deployed projects.</h1>
      </div>
      
      <div className="bcsc__projectOverview-container">
        {
          // projectContractsView.map(project => (
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

