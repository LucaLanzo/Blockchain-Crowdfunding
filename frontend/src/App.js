import React, { useEffect } from 'react';
import { Header, Footer, WhatFund, ProjectOverview} from './container';
import {Navbar, Build} from './components';
import { init, getAllProjects } from './web3/Web3Client'
import './App.css'

const App = () => {
  // useEffect(() => {
  //   init();
  // }, []);
  
  return (
  <div className='App' id='home'>
  <div className='gradient__bg'>
    <Navbar />
    <Header />
    <ProjectOverview />
  </div>

  <div className='gradient__bg'>
    <WhatFund />
    <Build />
    <Footer />
    </div>
  </div>
  )
};

export default App;
