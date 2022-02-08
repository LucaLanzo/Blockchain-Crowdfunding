import React from 'react';
import {Project} from '../../components';
import './projectOverview.css'

const ProjectOverview = () => {
   return (
   <div className="bcsc__projectOverview section__padding" id="project">
     <div className="bcsc__projectOverview-heading">
       <h1 className="gradient__text">Take a look at the, <br /> deployed projects.</h1>
     </div>
     <div className="bcsc__projectOverview-container">
       <div className="bcsc__projectOverview-container_group">
         <Project date="Jan 01, 2022" text="Project 1" />
       </div>
       <div className="bcsc__projectOverview-container_group">
         <Project date="Jan 01, 2022" text="Project 2" />
       </div>
       <div className="bcsc__projectOverview-container_group">
         <Project date="Jan 01, 2022" text="Project 3" />
       </div>
       
       
     </div>
   </div>
 );
}

export default ProjectOverview;

