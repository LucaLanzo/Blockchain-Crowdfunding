import React from 'react';
import './project.css';


const Project = ({state, date, title, description, amountToRaise, currentBalance, deadline}) => (
    
  
  <div className="bcsc__projectOverview-container_project">
    
    <div className="bcsc__projectOverview-container_project-content">
      <div>
        <p>{state}</p>
        <p id="date">{date}</p>
        <h3 id="header">{title}</h3>
        <p id="description">{description}</p>
        <p>Amount to Raise: {amountToRaise}</p>
        <p>Current Balance: {currentBalance}</p>
        <p>Deadline: {deadline}</p>
      </div>
    </div>
  </div>
);

export default Project;