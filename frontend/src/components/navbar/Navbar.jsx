import React, {useState} from 'react';
import {RiMenu3Line, RiCloseLine} from'react-icons/ri';
import  logo from '../../assets/logo.png'
import './navbar.css'
import { init } from '../../web3/Web3Client'

const Menu = () =>(
  <>
  <p><a href='#home'>Home</a></p>
     <p><a href='#whatfund'>What is Blockfund?</a></p>
     <p><a href='#project'>Projects</a></p>
     </>
)

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleConnect, setToggleConnect] = useState(true);

  const connectWallet = () => {
    init().then(tx => {
      console.log(tx);
      setToggleConnect(false);
    }).catch(err => {
      console.log(err);
      setToggleConnect(true);
    })
  }

  return <div className='bcsc__navbar'>
  <div className='bcsc__navbar-links'>
  <div className='bcsc__navbar-links_logo'>
  <img className='bcsc__navbar-links_logo' src={logo} alt=""/>
   </div>
   <div className='bcsc__navbar-links_container'>
     <Menu />
   </div>
   </div>
  {toggleConnect&&
    <div className='bcsc__navbar-connect'>
      <button type='button' onClick={() => connectWallet()}>Connect Wallet</button>
    </div>
  }
   <div className='bcsc__navbar-menu'>
  {toggleMenu
  ? <RiCloseLine color='#fff' size={27} onClick={() => setToggleMenu(false)}/>
  : <RiMenu3Line color='#fff' size={27} onClick={() => setToggleMenu(true)}/>  
  }
  {toggleMenu&& (
    <div className='bcsc__navbar-menu_container scale-up-center'>
      <div className='bcsc__navbar-menu_container-links'>
      <Menu />
      <div className='bcsc__navbar-menu_container-links-connect'>
      {toggleConnect&&
        <button type='button' onClick={() => connectWallet()}>Connect Wallet</button>
      }
    </div>
  </div>
  </div>
  )}
   </div>
  </div>;
}

export default Navbar;
