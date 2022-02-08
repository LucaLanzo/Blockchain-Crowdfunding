import React from 'react';
import './project.css';

  const Project = ({date, title, description, amountToRaise, currentBalance, deadline}) => (
  <div className="bcsc__projectOverview-container_project">
    
    <div className="bcsc__projectOverview-container_project-content">
      <div>
      <p>state</p>
        <p>Date: {date}</p>
        <h3>{title}</h3>
        <p>Description: {description}</p>
        <p>Amount to Raise: {amountToRaise}</p>
        <p>Current Balance: {currentBalance}</p>
        <p>Deadline: {deadline}</p>
      </div>
    </div>
  </div>
);

export default Project;