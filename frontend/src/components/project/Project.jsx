import React from 'react';
import './project.css';

const Project = ({date, title, description, amountToRaise, currentBalance, deadline}) => (
  <div className="bcsc__projectOverview-container_project">
    
    <div className="bcsc__projectOverview-container_project-content">
      <div>
        <p>{date}</p>
        <h3>{title}</h3>
        <p>{description}</p>
        <p>{amountToRaise}</p>
        <p>{currentBalance}</p>
        <p>{deadline}</p>
      </div>
    </div>
  </div>
);

export default Project;