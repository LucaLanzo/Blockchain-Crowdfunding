import React from 'react';
import './project.css';

const Project = ({date, text }) => (
  <div className="bcsc__projectOverview-container_project">
    
    <div className="bcsc__projectOverview-container_project-content">
      <div>
        <p>{date}</p>
        <h3>{text}</h3>
      </div>
      <p>"See Full Project"</p>
    </div>
  </div>
);

export default Project;